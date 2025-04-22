// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MusicSharesNFT
 * @dev Contract for creating and managing music NFTs with fractional ownership
 */
contract MusicSharesNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    
    // Platform address to receive fees
    address private platformAddress;
    
    // Platform fee percentage (5%)
    uint256 private constant PLATFORM_FEE = 5;

    // Struct to store NFT metadata
    struct MusicNFT {
        string title;
        string artist;
        uint256 totalShares;
        uint256 price; // Price per share in wei
        address creator;
        bool isActive;
    }

    uint256[] private allTokenIds;
    mapping(address => uint256[]) private ownedTokenIds;

    // Mapping from token ID to MusicNFT data
    mapping(uint256 => MusicNFT) public musicNFTs;
    
    // Mapping from token ID to shares per address
    mapping(uint256 => mapping(address => uint256)) public shares;
    
    // Events
    event MusicNFTCreated(uint256 tokenId, string title, string artist, address creator, uint256 price);
    event SharesPurchased(uint256 tokenId, address buyer, uint256 sharesAmount, uint256 totalCost);
    event PriceUpdated(uint256 tokenId, uint256 newPrice);
    event NFTDeactivated(uint256 tokenId);
    event PlatformFeeTransferred(uint256 tokenId, uint256 amount);

    /**
     * @dev Constructor that sets the platform address for fee collection
     * @param _platformAddress Address of the platform that will receive fees
     */
    constructor(address _platformAddress) ERC721("MusicSharesNFT", "MUSIC") Ownable(msg.sender) {
        require(_platformAddress != address(0), "Platform address cannot be zero address");
        platformAddress = _platformAddress;
    }

    /**
     * @dev Creates a new music NFT and mints it to the creator
     * @param _title Title of the music
     * @param _artist Artist name
     * @param _totalShares Total number of shares for this NFT
     * @param _price Price per share in wei
     * @param _tokenURI URI for the NFT metadata
     * @return New token ID
     */
    function createMusicNFT(
        string memory _title,
        string memory _artist,
        uint256 _totalShares,
        uint256 _price,
        string memory _tokenURI
    ) public returns (uint256) {
        require(_totalShares > 0, "Total shares must be greater than zero");
        require(_price > 0, "Price per share must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint the NFT to the creator
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        // Set up the NFT data
        musicNFTs[newTokenId] = MusicNFT({
            title: _title,
            artist: _artist,
            totalShares: _totalShares,
            price: _price,
            creator: msg.sender,
            isActive: true
        });
        
        // Creator initially owns all shares
        shares[newTokenId][msg.sender] = _totalShares;
        
        // Add token to global and owner arrays
        allTokenIds.push(newTokenId);
        ownedTokenIds[msg.sender].push(newTokenId);
        
        emit MusicNFTCreated(newTokenId, _title, _artist, msg.sender, _price);
        
        return newTokenId;
    }
    
    /**
     * @dev Allows users to buy shares of a music NFT
     * @param _tokenId ID of the NFT
     * @param _sharesAmount Number of shares to buy
     */
    function buyShares(uint256 _tokenId, uint256 _sharesAmount) public payable {
        require(_tokenId <= _tokenIds.current(), "NFT does not exist");
        require(musicNFTs[_tokenId].isActive, "NFT is not active for trading");
        require(_sharesAmount > 0, "Cannot buy zero shares");
        
        MusicNFT storage nft = musicNFTs[_tokenId];
        address creator = nft.creator;
        
        // Calculate the cost for the shares
        uint256 totalCost = nft.price.mul(_sharesAmount);
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Find seller (currently the creator or whoever holds shares)
        address seller = creator;
        require(shares[_tokenId][seller] >= _sharesAmount, "Seller doesn't have enough shares");
        
        // Transfer shares from seller to buyer
        shares[_tokenId][seller] = shares[_tokenId][seller].sub(_sharesAmount);
        shares[_tokenId][msg.sender] = shares[_tokenId][msg.sender].add(_sharesAmount);
        
        // Add token to buyer's owned tokens if they don't have it yet
        bool hasToken = false;
        for (uint i = 0; i < ownedTokenIds[msg.sender].length; i++) {
            if (ownedTokenIds[msg.sender][i] == _tokenId) {
                hasToken = true;
                break;
            }
        }
        if (!hasToken) {
            ownedTokenIds[msg.sender].push(_tokenId);
        }
        
        // Calculate platform fee (5% of total cost)
        uint256 platformFee = totalCost.mul(PLATFORM_FEE).div(100);
        uint256 sellerAmount = totalCost.sub(platformFee);
        
        // Transfer payment to platform and seller
        payable(platformAddress).transfer(platformFee);
        payable(seller).transfer(sellerAmount);
        
        // Emit event for platform fee transfer
        emit PlatformFeeTransferred(_tokenId, platformFee);
        
        // Refund excess payment if any
        uint256 excess = msg.value.sub(totalCost);
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
        
        emit SharesPurchased(_tokenId, msg.sender, _sharesAmount, totalCost);
    }
    
    /**
     * @dev Updates the price per share for a specific music NFT
     * @param _tokenId ID of the NFT
     * @param _newPrice New price per share in wei
     */
    function updatePrice(uint256 _tokenId, uint256 _newPrice) public {
        require(_tokenId <= _tokenIds.current(), "NFT does not exist");
        require(msg.sender == musicNFTs[_tokenId].creator, "Only creator can update price");
        require(_newPrice > 0, "Price must be greater than zero");
        
        musicNFTs[_tokenId].price = _newPrice;
        
        emit PriceUpdated(_tokenId, _newPrice);
    }
    
    /**
     * @dev Gets the current shares owned by an address for a specific NFT
     * @param _tokenId ID of the NFT
     * @param _owner Address of the shares owner
     * @return Number of shares owned
     */
    function getSharesOwned(uint256 _tokenId, address _owner) public view returns (uint256) {
        require(_tokenId <= _tokenIds.current(), "NFT does not exist");
        return shares[_tokenId][_owner];
    }

    /**
     * @dev Returns an array of all music NFTs
     * @return Array of MusicNFT structs
     */
    function getAllMusicNFTs() public view returns (MusicNFT[] memory) {
        uint256 total = _tokenIds.current();
        MusicNFT[] memory allNFTs = new MusicNFT[](total);

        for (uint256 i = 0; i < total; i++) {
            allNFTs[i] = musicNFTs[i + 1]; // tokenIds start from 1
        }

        return allNFTs;
    }
    
   
    function getMusicNFTDetails(uint256 tokenId) public view returns (
        string memory title, 
        string memory artist, 
        uint256 totalShares, 
        uint256 price, 
        uint256 sharesSold, 
        address creator, 
        bool isActive
    ) {
        require(tokenId <= _tokenIds.current(), "NFT does not exist");
        MusicNFT memory nft = musicNFTs[tokenId];
        
        // Calculate shares sold (creator's initial shares minus current shares)
        uint256 creatorInitialShares = nft.totalShares;
        uint256 creatorCurrentShares = shares[tokenId][nft.creator];
        uint256 soldShares = creatorInitialShares - creatorCurrentShares;
        
        return (
            nft.title, 
            nft.artist, 
            nft.totalShares, 
            nft.price, 
            soldShares, 
            nft.creator, 
            nft.isActive
        );
    }
    
    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId ID of the NFT
     * @return The URI for the token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Returns the total number of tokens in existence
     * @return The total supply of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Deactivates an NFT from being traded (can only be done by creator or contract owner)
     * @param _tokenId ID of the NFT to deactivate
     */
    function deactivateNFT(uint256 _tokenId) public {
        require(_tokenId <= _tokenIds.current(), "NFT does not exist");
        require(
            msg.sender == musicNFTs[_tokenId].creator || msg.sender == owner(),
            "Only creator or contract owner can deactivate"
        );
        
        musicNFTs[_tokenId].isActive = false;
        
        emit NFTDeactivated(_tokenId);
    }
    
    /**
     * @dev Returns a token by its position in the global list of tokens
     * @param index Position of the token in the global list
     * @return tokenId at the given index
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < allTokenIds.length, "Index out of bounds");
        return allTokenIds[index];
    }
    
    /**
     * @dev Returns a token owned by `owner` at a given index of its token list
     * @param owner Address for whom to query the token
     * @param index Position of the token in the owner's list
     * @return tokenId at the given index owned by the owner
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < ownedTokenIds[owner].length, "Index out of bounds");
        return ownedTokenIds[owner][index];
    }
    
    /**
     * @dev Returns an array of all NFT token IDs
     * @return Array of all token IDs
     */
    function getAllNFTs() public view returns (uint256[] memory) {
        return allTokenIds;
    }
    
    /**
     * @dev Returns an array of all NFT token IDs owned by an address
     * @param owner Address for whom to query the tokens
     * @return Array of token IDs owned by owner
     */
    function getOwnedNFTs(address owner) public view returns (uint256[] memory) {
        return ownedTokenIds[owner];
    }
    
    /**
     * @dev Returns the current platform address
     * @return The platform address
     */
    function getPlatformAddress() public view returns (address) {
        return platformAddress;
    }
    
    /**
     * @dev Returns the platform fee percentage
     * @return The platform fee percentage
     */
    function getPlatformFee() public pure returns (uint256) {
        return PLATFORM_FEE;
    }
}