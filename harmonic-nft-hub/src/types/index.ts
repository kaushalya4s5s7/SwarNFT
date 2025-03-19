
// Wallet types
export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  loading: boolean;
  error: string | null;
}

// Auth types
export type UserRole = "listener" | "artist" | null;

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  hasSelectedRole: boolean;
  loading: boolean;
  error: string | null;
}

// Music types
export interface NFT {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  price: number;
  totalShares: number;
  availableShares: number;
  owners: {
    address: string;
    shares: number;
  }[];
}

export interface MusicState {
  trending: NFT[];
  collection: NFT[];
  currentlyPlaying: NFT | null;
  isPlaying: boolean;
  queue: NFT[];
  loading: boolean;
  error: string | null;
}

// Artist Dashboard types
export interface Earnings {
  total: number;
  lastMonth: number;
  lastWeek: number;
  byTrack: {
    trackId: string;
    title: string;
    amount: number;
  }[];
}

export interface ArtistState {
  uploads: NFT[];
  earnings: Earnings;
  loading: boolean;
  error: string | null;
}
