
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { setRole, authSuccess } from '@/features/auth/authSlice';
import { UserRole } from '@/types';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionModal = ({ isOpen, onClose }: RoleSelectionModalProps) => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    dispatch(setRole(selectedRole));
    dispatch(authSuccess());
    toast.success(`You are now registered as a ${selectedRole}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-neon-green/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose Your Role</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select whether you want to join as a listener or an artist. This choice is permanent and cannot be changed later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('listener')}
            className={`cursor-pointer p-6 rounded-xl border ${
              selectedRole === 'listener'
                ? 'border-neon-green bg-neon-green/10'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <h3 className="text-lg font-medium mb-2">Listener</h3>
            <p className="text-sm text-gray-400">
              Discover music, collect NFTs, and support your favorite artists.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('artist')}
            className={`cursor-pointer p-6 rounded-xl border ${
              selectedRole === 'artist'
                ? 'border-neon-green bg-neon-green/10'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <h3 className="text-lg font-medium mb-2">Artist</h3>
            <p className="text-sm text-gray-400">
              Upload music, mint NFTs, and earn royalties from your creations.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-white">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-neon-green text-black hover:bg-neon-green/90">
            Confirm Selection
          </Button>
        </div>

        <p className="text-xs text-red-400 mt-4">
          Warning: Your role selection is permanent and cannot be changed once confirmed.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
