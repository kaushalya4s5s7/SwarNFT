import Spline from "@splinetool/react-spline";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Pages
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Trending from "./pages/Trending";
import Collection from "./pages/Collection";
import Community from "./pages/Community";
import Whitepaper from "./pages/Whitepaper";
import ListenerDashboard from "./pages/ListenerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Redux reducers
import walletReducer from "./features/wallet/walletSlice";
import authReducer from "./features/auth/authSlice";
import musicReducer from "./features/music/musicSlice";

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet", "auth", "music"], // only these reducers will be persisted
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  auth: authReducer,
  music: musicReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

// Create query client for React Query
const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/community" element={<Community />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route
                path="/listener-dashboard"
                element={<ListenerDashboard />}
              />
              <Route path="/artist-dashboard" element={<ArtistDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
