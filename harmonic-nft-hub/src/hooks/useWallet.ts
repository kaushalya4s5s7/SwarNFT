
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  setChainId,
} from '@/features/wallet/walletSlice';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const dispatch = useDispatch();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);
          
          // Check if already connected
          const accounts = await ethersProvider.listAccounts();
          if (accounts.length > 0) {
            const address = accounts[0].address;
            const network = await ethersProvider.getNetwork();
            const chainId = Number(network.chainId);
            
            dispatch(connectWalletSuccess({ address, chainId }));
          }
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId: string) => {
            const chainIdNumber = parseInt(chainId, 16);
            dispatch(setChainId(chainIdNumber));
            toast.info('Network changed');
          });
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              dispatch(disconnectWallet());
              toast.info('Wallet disconnected');
            } else {
              connectWallet(); // Reconnect with the new account
            }
          });
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [dispatch]);

  const connectWallet = useCallback(async () => {
    if (!provider) {
      toast.error('No Ethereum wallet detected. Please install MetaMask.');
      return null;
    }

    try {
      setLoading(true);
      dispatch(connectWalletStart());
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        
        dispatch(connectWalletSuccess({ address, chainId }));
        toast.success('Wallet connected successfully');
        return { address, chainId };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      dispatch(connectWalletFailure(error.message || 'Failed to connect wallet'));
      toast.error(error.message || 'Failed to connect wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, [provider, dispatch]);

  const disconnectWalletFn = useCallback(() => {
    dispatch(disconnectWallet());
    toast.info('Wallet disconnected');
  }, [dispatch]);

  const switchNetwork = useCallback(async (chainId: number) => {
    if (!provider) return;

    try {
      setLoading(true);
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` },
      ]);
      toast.success('Network switched successfully');
    } catch (error: any) {
      console.error('Error switching network:', error);
      
      // If the chain doesn't exist, suggest adding it
      if (error.code === 4902) {
        try {
          await addNetwork(chainId);
        } catch (addError) {
          toast.error('Failed to add network');
        }
      } else {
        toast.error(error.message || 'Failed to switch network');
      }
    } finally {
      setLoading(false);
    }
  }, [provider]);

  const addNetwork = useCallback(async (chainId: number) => {
    if (!provider) return;

    const networkParams = getNetworkParams(chainId);
    if (!networkParams) {
      toast.error('Unknown network');
      return;
    }

    try {
      await provider.send('wallet_addEthereumChain', [networkParams]);
      toast.success('Network added successfully');
    } catch (error: any) {
      console.error('Error adding network:', error);
      toast.error(error.message || 'Failed to add network');
    }
  }, [provider]);

  // Helper function to get network parameters
  const getNetworkParams = (chainId: number) => {
    switch (chainId) {
      case 1: // Ethereum Mainnet
        return {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://mainnet.infura.io/v3/'],
          blockExplorerUrls: ['https://etherscan.io']
        };
      case 11155111: // Sepolia Testnet
        return {
          chainId: '0xaa36a7',
          chainName: 'Sepolia Testnet',
          nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://sepolia.infura.io/v3/'],
          blockExplorerUrls: ['https://sepolia.etherscan.io']
        };
      case 80001: // Mumbai Testnet
        return {
          chainId: '0x13881',
          chainName: 'Mumbai Testnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com']
        };
      default:
        return null;
    }
  };

  return {
    provider,
    loading,
    connectWallet,
    disconnectWallet: disconnectWalletFn,
    switchNetwork,
    addNetwork
  };
}
