const { ethers } = require("ethers");
const NFT = require("../../models/Nft");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const ABI = require("../../contracts/NFTContractABI.json"); // Replace with your ABI

exports.mintNFT = async (musicId, artistId, metadataURI) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tx = await contract.mintNFT(artistId, metadataURI);
  await tx.wait();

  const newNFT = new NFT({ musicId, artistId, owner: artistId, metadataURI });
  await newNFT.save();

  return { nftId: tx.hash, transactionHash: tx.hash };
};

exports.getNFTsByOwner = async (userId) => {
  const nfts = await NFT.find({ owner: userId }).select("-__v");
  return nfts;
};
