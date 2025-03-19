
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MusicState, NFT } from '@/types';

const initialState: MusicState = {
  trending: [],
  collection: [],
  currentlyPlaying: null,
  isPlaying: false,
  queue: [],
  loading: false,
  error: null,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    fetchMusicStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTrendingSuccess: (state, action: PayloadAction<NFT[]>) => {
      state.trending = action.payload;
      state.loading = false;
    },
    fetchCollectionSuccess: (state, action: PayloadAction<NFT[]>) => {
      state.collection = action.payload;
      state.loading = false;
    },
    fetchMusicFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    playTrack: (state, action: PayloadAction<NFT>) => {
      state.currentlyPlaying = action.payload;
      state.isPlaying = true;
    },
    pauseTrack: (state) => {
      state.isPlaying = false;
    },
    resumeTrack: (state) => {
      state.isPlaying = true;
    },
    addToQueue: (state, action: PayloadAction<NFT>) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
  },
});

export const {
  fetchMusicStart,
  fetchTrendingSuccess,
  fetchCollectionSuccess,
  fetchMusicFailure,
  playTrack,
  pauseTrack,
  resumeTrack,
  addToQueue,
  clearQueue,
} = musicSlice.actions;

export default musicSlice.reducer;
