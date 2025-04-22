import { Contract } from "ethers";

const MUSIC_NFT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "artist", type: "string" },
      { internalType: "uint256", name: "totalShares", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "createMusicNFT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "sharesAmount", type: "uint256" },
    ],
    name: "buyShares",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "newPrice", type: "uint256" },
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getSharesOwned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMusicNFTs",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "uint256", name: "totalShares", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "bool", name: "isActive", type: "bool" },
        ],
        internalType: "struct MusicSharesNFT.MusicNFT[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getMusicNFTDetails",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "artist", type: "string" },
      { internalType: "uint256", name: "totalShares", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "sharesSold", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "deactivateNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllNFTs",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getOwnedNFTs",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const MUSIC_NFT_ADDRESS = "0x1E0db2322823E2ab1049FEaCA3f26E48041F0412";

export { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESS };

// Add type for contract instance
export type MusicNFTContract = Contract;
