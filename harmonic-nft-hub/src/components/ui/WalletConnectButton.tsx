
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import RoleSelectionModal from '@/components/ui/RoleSelectionModal';
import { authSuccess, logout } from '@/features/auth/authSlice';
import { WalletState } from '@/types';
import { Loader2, ChevronDown, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const WalletConnectButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connectWallet, disconnectWallet, switchNetwork, loading } = useWallet();
  const wallet = useSelector((state: any) => state.wallet as WalletState);
  const auth = useSelector((state: any) => state.auth);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result) {
      // Check if the user has already selected a role
      if (!auth.hasSelectedRole) {
        setShowRoleModal(true);
      } else {
        dispatch(authSuccess());
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    dispatch(logout());
    toast.success("Disconnected from wallet");
    navigate('/');
  };

  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork(chainId);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 11155111:
        return 'Sepolia';
      case 80001:
        return 'Mumbai';
      default:
        return 'Unknown Network';
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={wallet.connected ? 'connected' : 'disconnected'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {wallet.connected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-black/30 border border-neon-green/30 hover:border-neon-green text-white hover:text-neon-green transition-all"
                >
                  {wallet.address && formatAddress(wallet.address)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border border-neon-green/30 backdrop-blur-xl text-white">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>Connected Wallet</span>
                    <span className="text-xs text-gray-400 mt-1">{wallet.address}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuLabel>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Network</span>
                    <span className="text-sm font-medium text-neon-green">
                      {getNetworkName(wallet.chainId || 0)}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => handleSwitchNetwork(1)}
                  className="cursor-pointer hover:bg-white/10 hover:text-neon-green"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch to Ethereum
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSwitchNetwork(11155111)}
                  className="cursor-pointer hover:bg-white/10 hover:text-neon-green"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch to Sepolia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSwitchNetwork(80001)}
                  className="cursor-pointer hover:bg-white/10 hover:text-neon-green"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch to Mumbai
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleDisconnect}
                  className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-neon-green text-black hover:bg-neon-green/90 transition-all font-medium"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'CONNECT WALLET'
              )}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
      />
    </>
  );
};

export default WalletConnectButton;
