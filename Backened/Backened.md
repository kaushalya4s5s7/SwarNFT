|── backend/ # Backend API and business logic
│ │ ├── api/ # API layer (controllers and routes)
│ │ │ ├── routes/ # API endpoint definitions
│ │ │ │ ├── auth.js # Authentication routes
│ │ │ │ ├── nft.js # NFT-related routes
│ │ │ │ ├── music.js # Music-related routes
│ │ │ │ ├── recommendations.js # Recommendation routes
│ │ │ │ ├── royalty.js # Royalty distribution routes
│ │ │ │ └── user.js # User-related routes
│ │ │ └── controllers/ # Business logic for each route
│ │ │ ├── authController.js
│ │ │ ├── nftController.js
│ │ │ ├── musicController.js
│ │ │ ├── recommendationController.js
│ │ │ ├── royaltyController.js
│ │ │ └── userController.js
│ │ ├── services/ # Business logic services
│ │ │ ├── authService.js # Authentication logic
│ │ │ ├── musicService.js # Music-related logic
│ │ │ ├── recommendationService.js # Recommendation logic
│ │ │ ├── royaltyService.js # Royalty distribution logic
│ │ │ └── userService.js # User-related logic
│ │ ├── middleware/ # Custom middleware
│ │ │ ├── auth.js # Authentication middleware
│ │ │ ├── errorHandler.js # Error handling middleware
│ │ │ └── validation.js # Request validation middleware
│ │ ├── models/ # Database models (e.g., User, Music, NFT)
│ │ │ ├── User.js
│ │ │ ├── Music.js
│ │ │ └── NFT.js
│ │ ├── utils/ # Utility functions
│ │ │ ├── logger.js # Logging utility
│ │ │ ├── config.js # Configuration loader
│ │ │ └── helpers.js # General helper functions
│ │ └── app.js # Main application entry point

# Backend API Documentation

This document outlines the APIs required for the **Hybrid AI + NFT Music Recommendation System**. Each API is designed to support key features such as AI-powered recommendations, NFT integration, royalty distribution, and user/artist interactions.

---

## **Authentication APIs**

### 1. **Connect Wallet**

- **Endpoint**: `POST /api/auth/connect-wallet`
- **Description**: Checks if a user exists based on their wallet address. If not, prompts for role selection.
- **Request Body**:
  ```json
  {
    "walletAddress": "0xWalletAddress"
  }
  ```
- **Response**:
  - If user exists:
    ```json
    {
      "token": "jwt_token_here",
      "role": "listener" // or "artist"
    }
    ```
  - If user does not exist:
    ```json
    {
      "message": "Role selection required"
    }
    ```

### 2. **Register with Role**

- **Endpoint**: `POST /api/auth/register-role`
- **Description**: Registers a new user with their wallet address and selected role.
- **Request Body**:
  ```json
  {
    "walletAddress": "0xWalletAddress",
    "role": "listener" // or "artist"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "role": "listener" // or "artist"
  }
  ```

## **User APIs**

### 3. **Get User Profile**

- **Endpoint**: `GET /api/user/:userId`
- **Description**: Fetches user profile details.
- **Response**:
  ```json
  {
    "walletAddress": "0xWalletAddress",
    "role": "artist",
    "nftsOwned": ["nft123", "nft456"]
  }
  ```

### 4. **Update User Preferences**

- **Endpoint**: `PUT /api/user/preferences`
- **Description**: Updates user music preferences (e.g., favorite genres, artists).
- **Request Body**:
  ```json
  {
    "userId": "12345",
    "preferences": {
      "genres": ["rock", "jazz"],
      "artists": ["artist123", "artist456"]
    }
  }
  ```

## **Music APIs**

### 5. **Upload Music**

- **Endpoint**: `POST /api/music/upload`
- **Description**: Allows artists to upload music and mint it as an NFT.
- **Request Body**:
  ```json
  {
    "artistId": "12345",
    "title": "Song Title",
    "genre": "Rock",
    "file": "music_file.mp3",
    "metadata": {
      "description": "A great rock song",
      "artwork": "artwork_url"
    }
  }
  ```
- **Response**:
  ```json
  {
    "musicId": "67890",
    "nftAddress": "0xNFTAddress"
  }
  ```

### 6. **Get Music Details**

- **Endpoint**: `GET /api/music/:musicId`
- **Description**: Fetches details of a specific music track.
- **Response**:
  ```json
  {
    "title": "Song Title",
    "artist": "artist123",
    "genre": "Rock",
    "nftAddress": "0xNFTAddress",
    "streamCount": 1000
  }
  ```

## **NFT APIs**

### 7. **Mint NFT**

- **Endpoint**: `POST /api/nft/mint`
- **Description**: Mints a new NFT for a music track.
- **Request Body**:
  ```json
  {
    "musicId": "67890",
    "artistId": "12345",
    "metadataURI": "ipfs://metadata_uri"
  }
  ```
- **Response**:
  ```json
  {
    "nftId": "nft123",
    "transactionHash": "0xTxHash"
  }
  ```

### 8. **Get NFTs by Owner**

- **Endpoint**: `GET /api/nft/owner/:userId`
- **Description**: Fetches all NFTs owned by a user.
- **Response**:
  ```json
  [
    {
      "nftId": "nft123",
      "musicId": "67890",
      "title": "Song Title",
      "artist": "artist123"
    }
  ]
  ```

## **Recommendation APIs**

### 9. **Get Personalized Recommendations**

- **Endpoint**: `GET /api/recommendations/:userId`
- **Description**: Fetches AI-powered music recommendations for a user.
- **Response**:
  ```json
  {
    "recommendations": [
      {
        "musicId": "67890",
        "title": "Song Title",
        "artist": "artist123",
        "genre": "Rock"
      }
    ]
  }
  ```

## **Middleware**

### 1. **Authentication Middleware**

- **File**: `src/backend/middleware/auth.js`
- **Description**: Verifies JWT tokens and ensures authenticated access to protected routes.

### 2. **Error Handling Middleware**

- **File**: `src/backend/middleware/errorHandler.js`
- **Description**: Handles errors and sends appropriate responses to the client.

### 3. **Validation Middleware**

- **File**: `src/backend/middleware/validation.js`
- **Description**: Validates request bodies and parameters before processing.

## **Database Models**

### 1. **User Model**

- **File**: `src/backend/models/User.js`
- **Description**: Stores user details, including wallet address, role, and preferences.

### 2. **Music Model**

- **File**: `src/backend/models/Music.js`
- **Description**: Stores music details, including title, artist, genre, and NFT address.

### 3. **NFT Model**

- **File**: `src/backend/models/NFT.js`
- **Description**: Stores NFT details, including music ID, owner address, and transaction history.

## **Utility Functions**

### 1. **Logger**

- **File**: `src/backend/utils/logger.js`
- **Description**: Logs application events and errors.

### 2. **Configuration Loader**

- **File**: `src/backend/utils/config.js`
- **Description**: Loads environment variables and configuration settings.

### 3. **Helpers**

- **File**: `src/backend/utils/helpers.js`
- **Description**: General helper functions for common tasks.
