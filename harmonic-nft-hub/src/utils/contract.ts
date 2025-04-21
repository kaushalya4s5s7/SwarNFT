import { Contract } from "ethers";

const MUSIC_NFT_ABI = [
  "function createMusicNFT(string title, string artist, uint256 totalShares, uint256 price, string tokenURI) public returns (uint256)",
  "function buyShares(uint256 tokenId, uint256 sharesAmount) public payable",
  "function updatePrice(uint256 tokenId, uint256 newPrice) public",
  "function getSharesOwned(uint256 tokenId, address owner) public view returns (uint256)",
  "function getMusicNFTDetails(uint256 tokenId) public view returns (tuple(string title, string artist, uint256 totalShares, uint256 price, address creator, bool isActive))",
  "function getAllMusicNFTs() public view returns (tuple(string title, string artist, uint256 totalShares, uint256 price, address creator, bool isActive)[])",
  "function deactivateNFT(uint256 tokenId) public",
  "function tokenByIndex(uint256 index) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function getAllNFTs() public view returns (uint256[])",
  "function getOwnedNFTs(address owner) public view returns (uint256[])",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function owner() public view returns (address)",
  "function transferOwnership(address newOwner) public",
  "function ownerOf(uint256 tokenId) public view returns (address)", // ✅ Added ownerOf function
] as const;

const MUSIC_NFT_ADDRESS = "0xD05960beC7dcdd415E85f2eCf36Da58DD76a03EF";

export { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESS };

// Add type for contract instance
export type MusicNFTContract = Contract;
