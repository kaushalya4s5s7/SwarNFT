import { ethers } from "ethers";
import { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESS } from "./contract";

export interface NFT {
  id: number;
  uri: string;
  metadata: NFTMetadata | null;
  owner: string;
  title: string;
  artist: string;
  totalShares: number;
  sharesSold: number;
  price: bigint;
  isActive: boolean;
  fractionAddress: string | null;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  artist: string;
  playbackUrl: string;
}

export interface ShareOwnership {
  tokenId: number;
  shares: number;
  totalShares: number;
  percentage: number;
}

export interface FractionOwnership {
  tokenId: number;
  balance: number;
  totalSupply: number;
  percentage: number;
  fractionAddress: string;
}

// Add IPFS gateway array at the top of the file
const IPFS_GATEWAYS = [
  "teal-defiant-opossum-188.mypinata.cloud",
  "https://gateway.pinata.cloud",
  "https://ipfs.io",
  "https://cloudflare-ipfs.com",
];

// Update the formatIpfsUri function to try multiple gateways
const formatIpfsUri = (uri: string): string[] => {
  if (!uri) return [];
  if (!uri.startsWith("ipfs://")) return [uri];

  const hash = uri.replace("ipfs://", "");
  return IPFS_GATEWAYS.map((gateway) => `${gateway}/ipfs/${hash}`);
};

// Add a function to fetch with fallback
const fetchWithFallback = async (urls: string[]): Promise<Response> => {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }
  throw new Error("All gateways failed");
};

// Get NFT contract instance
export const getMusicNFTContract = (
  providerOrSigner: ethers.BrowserProvider | ethers.JsonRpcSigner
) => {
  return new ethers.Contract(
    MUSIC_NFT_ADDRESS,
    MUSIC_NFT_ABI,
    providerOrSigner
  );
};

const handleContractError = (error: any) => {
  console.error("Contract Error:", error);

  if (error.message.includes("execution reverted")) {
    throw new Error("Transaction failed: The contract rejected the operation");
  }

  if (error.code === "CALL_EXCEPTION") {
    throw new Error(
      "Contract call failed: The contract may not be deployed or accessible"
    );
  }

  throw error;
};

// Wrap contract calls with error handler
export const safeContractCall = async <T>(
  callback: () => Promise<T>
): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    return handleContractError(error);
  }
};

// Create new music NFT
export const createMusicNFT = async (
  signer: ethers.JsonRpcSigner,
  title: string,
  artist: string,
  totalShares: number,
  price: bigint,
  metadataURI: string
): Promise<number | null> => {
  try {
    const contract = getMusicNFTContract(signer);
    const tx = await contract.createMusicNFT(
      title,
      artist,
      totalShares,
      price,
      metadataURI
    );
    const receipt = await tx.wait();

    // Get tokenId from MusicNFTCreated event
    const event = receipt.logs.find(
      (log: any) => log.fragment && log.fragment.name === "MusicNFTCreated"
    );

    return event ? Number(event.args.tokenId) : null;
  } catch (error) {
    console.error("Error creating music NFT:", error);
    throw error;
  }
};
// Alias for createMusicNFT to maintain compatibility with MintForm.tsx
export const mintNFT = createMusicNFT;

// Buy shares of an NFT
export const buyShares = async (
  signer: ethers.JsonRpcSigner,
  tokenId: number,
  shares: number,
  price: bigint
) => {
  try {
    const contract = getMusicNFTContract(signer);
    const totalPrice = price * BigInt(shares);

    // First approve the contract to spend tokens if needed
    const tx = await contract.buyShares(tokenId, shares, {
      value: totalPrice,
      gasLimit: 300000, // Add explicit gas limit
    });

    const receipt = await tx.wait();
    return receipt.status === 1;
  } catch (error) {
    console.error("Error buying shares:", error);
    throw new Error(error.message || "Failed to buy shares");
  }
};

// Get shares owned by an address
export const getSharesOwned = async (
  provider: ethers.BrowserProvider,
  tokenId: number,
  address: string
) => {
  const contract = getMusicNFTContract(provider);
  return Number(await contract.getSharesOwned(tokenId, address));
};

// Update getNFTDetails function
export const getNFTDetails = async (
  provider: ethers.BrowserProvider,
  tokenId: number
): Promise<NFT> => {
  try {
    const contract = getMusicNFTContract(provider);

    // Get NFT details first
    const details = await contract.getMusicNFTDetails(tokenId);
    console.log("tokenId:", tokenId);
    console.log("details:", details);

    // Try to get tokenURI and owner if available
    let uri = "";
    let owner = details.creator;
    let metadata = null;

    try {
      // Use IPFS gateway to fetch metadata
      uri = await contract.tokenURI(tokenId);
      console.log("uri:", uri);

      // Convert IPFS URI to a valid HTTP URL using a gateway
      const ipfsUrl = uri.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Fetch metadata from IPFS
      const response = await fetch(ipfsUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }
      metadata = await response.json(); // Parse the metadata JSON
      console.log("metadata:", metadata);
    } catch (error) {
      console.warn(`Error fetching metadata for ${tokenId}:`, error);
    }

    try {
      owner = await contract.ownerOf(tokenId);
    } catch (error) {
      console.warn(`OwnerOf not available for ${tokenId}:`, error);
    }

    // Fetch metadata if URI is available
    if (uri) {
      try {
        const urls = formatIpfsUri(uri);
        const response = await fetchWithFallback(urls);
        metadata = await response.json();
      } catch (error) {
        console.error(`Error fetching metadata for token ${tokenId}:`, error);
      }
    }

    const { title, artist, totalShares, price, sharesSold, creator, isActive } =
      details;

    return {
      id: tokenId,
      uri,
      metadata,
      owner: owner || creator,
      title,
      artist,
      totalShares: Number(totalShares),
      price,
      sharesSold: Number(sharesSold),
      isActive,
      fractionAddress: MUSIC_NFT_ADDRESS,
    };
  } catch (error) {
    console.error(`Error in getNFTDetails for token ${tokenId}:`, error);
    throw error;
  }
};

// Fetch NFTs owned by an address
export const fetchOwnedNFTs = async (
  provider: ethers.BrowserProvider,
  address: string
): Promise<NFT[]> => {
  try {
    const contract = getMusicNFTContract(provider);
    const ownedTokenIds = await contract.getOwnedNFTs(address);
    const nfts: NFT[] = [];

    for (const tokenId of ownedTokenIds) {
      try {
        // Get NFT details
        const nft = await getNFTDetails(provider, tokenId);
        nfts.push(nft);
      } catch (error) {
        console.error(`Error fetching NFT ${tokenId}:`, error);
      }
    }

    return nfts;
  } catch (error) {
    console.error("Error fetching owned NFTs:", error);
    return [];
  }
};

// Update fetchListedNFTs to use getAllNFTs
export const fetchListedNFTs = async (
  provider: ethers.BrowserProvider
): Promise<NFT[]> => {
  try {
    const contract = getMusicNFTContract(provider);
    let allTokenIds: number[] = [];

    try {
      // Try to get all NFTs
      allTokenIds = await contract.getAllNFTs();
    } catch (error) {
      console.warn("getAllNFTs failed, falling back to totalSupply:", error);
      try {
        // Fallback to totalSupply
        const totalSupply = await contract.totalSupply();
        allTokenIds = Array.from(
          { length: Number(totalSupply) },
          (_, i) => i + 1
        );
      } catch (fallbackError) {
        console.error("Fallback to totalSupply also failed:", fallbackError);
        return [];
      }
    }

    const nfts: NFT[] = [];

    // Use Promise.allSettled to handle failures gracefully
    const results = await Promise.allSettled(
      allTokenIds.map((tokenId) => getNFTDetails(provider, tokenId))
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.isActive) {
        nfts.push(result.value);
      } else if (result.status === "rejected") {
        console.error(
          `Failed to fetch NFT ${allTokenIds[index]}:`,
          result.reason
        );
      }
    });

    return nfts;
  } catch (error) {
    console.error("Error fetching listed NFTs:", error);
    return [];
  }
};

// Update NFT price
export const updatePrice = async (
  signer: ethers.JsonRpcSigner,
  tokenId: number,
  newPrice: bigint
) => {
  try {
    const contract = getMusicNFTContract(signer);
    const tx = await contract.updatePrice(tokenId, newPrice);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error updating price:", error);
    throw error;
  }
};

// Deactivate NFT
export const deactivateNFT = async (
  signer: ethers.JsonRpcSigner,
  tokenId: number
) => {
  try {
    const contract = getMusicNFTContract(signer);
    const tx = await contract.deactivateNFT(tokenId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error deactivating NFT:", error);
    throw error;
  }
};

// Create fractions for an NFT
export const createFractions = async (
  signer: ethers.JsonRpcSigner,
  tokenId: number,
  totalSupply: number
): Promise<string> => {
  // Since we're using a consolidated contract, we return the NFT contract address
  // In our case, the fractions are managed within the same NFT contract
  console.log(`Creating ${totalSupply} fractions for token ID ${tokenId}`);
  return MUSIC_NFT_ADDRESS;
};

// Fetch fractions owned by an address
export const fetchOwnedFractions = async (
  provider: ethers.BrowserProvider,
  address: string
) => {
  try {
    const contract = getMusicNFTContract(provider);
    // Get total NFT count
    const totalNFTs = Number(await contract.totalSupply());
    const fractions: FractionOwnership[] = [];

    // For each NFT, check if the user owns shares (not the entire NFT)
    for (let i = 1; i <= totalNFTs; i++) {
      try {
        const sharesOwned = await getSharesOwned(provider, i, address);

        // If user owns some shares
        if (sharesOwned > 0) {
          try {
            const owner = await contract.ownerOf(i);
            // Only include if user doesn't fully own the NFT
            if (owner.toLowerCase() !== address.toLowerCase()) {
              const [title, artist, totalShares, price, sharesSold, isActive] =
                await contract.getMusicNFTDetails(i);

              // Only include if active
              if (isActive) {
                fractions.push({
                  tokenId: i,
                  balance: sharesOwned,
                  totalSupply: Number(totalShares),
                  percentage: (sharesOwned / Number(totalShares)) * 100,
                  fractionAddress: MUSIC_NFT_ADDRESS,
                });
              }
            }
          } catch (error) {
            console.error(`Error getting owner for token ${i}:`, error);
            continue;
          }
        }
      } catch (error) {
        // NFT might not exist, skip it
        console.error(`Error checking shares for token ${i}:`, error);
        continue;
      }
    }

    return fractions;
  } catch (error) {
    console.error("Error fetching owned fractions:", error);
    return [];
  }
};
