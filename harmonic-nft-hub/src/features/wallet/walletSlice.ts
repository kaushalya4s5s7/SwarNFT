
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '@/types';

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  loading: false,
  error: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWalletStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    connectWalletSuccess: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.connected = true;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.loading = false;
    },
    connectWalletFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    disconnectWallet: (state) => {
      return initialState;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
  },
});

export const {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  setChainId,
} = walletSlice.actions;

export default walletSlice.reducer;
