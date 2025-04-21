import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

// Types
type Role = "artist" | "listener" | null;

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  role: Role;
  setUserRole: (role: Role) => void;
  switchNetwork: () => Promise<void>;
}

interface Web3ProviderProps {
  children: ReactNode;
}

// Create context with a default value
const Web3Context = createContext<Web3ContextType | null>(null);

// Provider component
export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [role, setRole] = useState<Role>(null);

  // Sepolia testnet chain ID
  const SEPOLIA_CHAIN_ID = 11155111;

  // Initialize wallet connection if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();

          if (accounts.length > 0) {
            const network = await browserProvider.getNetwork();
            const connectedSigner = await browserProvider.getSigner();

            setAccount(accounts[0].address);
            setProvider(browserProvider);
            setSigner(connectedSigner);
            setChainId(Number(network.chainId));

            // Load role from localStorage if exists
            const savedRole = localStorage.getItem("userRole");
            if (savedRole) {
              setRole(savedRole as Role);
            }
          }
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          // Refresh signer with new account
          if (provider) {
            provider.getSigner().then((newSigner) => setSigner(newSigner));
          }
        }
      });

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      });

      return () => {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      };
    }
  }, [provider]);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await browserProvider.listAccounts();
        const network = await browserProvider.getNetwork();
        const connectedSigner = await browserProvider.getSigner();

        setAccount(accounts[0].address);
        setProvider(browserProvider);
        setSigner(connectedSigner);
        setChainId(Number(network.chainId));
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another Ethereum wallet extension");
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setRole(null);
    localStorage.removeItem("userRole");
  };

  // Set user role and save to localStorage
  const setUserRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("userRole", newRole);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  // Switch to Sepolia network
  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      }
      console.error("Failed to switch network:", error);
    }
  };

  // Check if connected to the correct network
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  // Context value
  const contextValue = {
    account,
    provider,
    signer,
    chainId,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    role,
    setUserRole,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};

// Custom hook to use the Web3Context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
