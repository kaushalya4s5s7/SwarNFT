import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setRole, authSuccess } from "@/features/auth/authSlice";
import { UserRole } from "@/types";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionModal = ({ isOpen, onClose }: RoleSelectionModalProps) => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingUserData, setExistingUserData] = useState<{
    registered: boolean;
    role?: UserRole;
  } | null>(null);

  const BACKEND_URL = "http://localhost:5002"; // Change to live backend URL when deploying

  // Check if user is already registered when modal opens
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!isOpen || !window.ethereum?.selectedAddress) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/auth/check-user?walletAddress=${window.ethereum.selectedAddress}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (data.success && data.registered) {
          setExistingUserData({
            registered: true,
            role: data.role,
          });

          // Pre-select the role if user is already registered
          if (data.role) {
            setSelectedRole(data.role);
          }
        } else {
          setExistingUserData({ registered: false });
        }
      } catch (error) {
        console.error("Failed to check existing user:", error);
        toast.error("Failed to verify account status");
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingUser();
  }, [isOpen]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }

    setIsLoading(true);

    try {
      // If user is already registered with the same role, just log them in
      if (
        existingUserData?.registered &&
        existingUserData.role === selectedRole
      ) {
        console.log("User already registered with this role, logging in");
        dispatch(setRole(selectedRole));
        dispatch(authSuccess());
        toast.success(`Welcome back! You're logged in as a ${selectedRole}`);
        onClose();
        return;
      }

      // If user is already registered with a different role, show error
      if (
        existingUserData?.registered &&
        existingUserData.role !== selectedRole
      ) {
        toast.error(
          `You're already registered as a ${existingUserData.role}. This cannot be changed.`
        );
        setSelectedRole(existingUserData.role);
        return;
      }

      // Otherwise register the new user
      console.log("Sending Request to Backend:", {
        walletAddress: window.ethereum.selectedAddress,
        role: selectedRole,
      });

      const response = await fetch(`${BACKEND_URL}/api/auth/register-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: window.ethereum.selectedAddress,
          role: selectedRole,
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        toast.success(`You are now registered as a ${selectedRole}`);
        dispatch(setRole(selectedRole));
        dispatch(authSuccess());
        onClose();
      } else {
        // If registration failed due to existing user
        if (data.error && data.error.includes("already registered")) {
          // Try to get their existing role
          const userCheckResponse = await fetch(
            `${BACKEND_URL}/api/auth/connect-wallet`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          const userData = await userCheckResponse.json();

          if (userData.success && userData.registered) {
            dispatch(setRole(userData.role));
            dispatch(authSuccess());
            toast.success(
              `You're already registered as a ${userData.role}. Redirecting to dashboard.`
            );
            onClose();
          } else {
            toast.error("Registration failed. Please try again later.");
          }
        } else {
          toast.error(data.error || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Request Failed:", error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-neon-green/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {existingUserData?.registered ? "Welcome Back" : "Choose Your Role"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {existingUserData?.registered
              ? `You're already registered as a ${existingUserData.role}. This choice is permanent.`
              : "Select whether you want to join as a listener or an artist. This choice is permanent and cannot be changed later."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect("listener")}
            className={`cursor-pointer p-6 rounded-xl border ${
              selectedRole === "listener"
                ? "border-neon-green bg-neon-green/10"
                : "border-gray-700 hover:border-gray-500"
            } ${
              existingUserData?.registered &&
              existingUserData.role !== "listener"
                ? "opacity-50 cursor-not-allowed"
                : ""
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
            onClick={() => handleRoleSelect("artist")}
            className={`cursor-pointer p-6 rounded-xl border ${
              selectedRole === "artist"
                ? "border-neon-green bg-neon-green/10"
                : "border-gray-700 hover:border-gray-500"
            } ${
              existingUserData?.registered && existingUserData.role !== "artist"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <h3 className="text-lg font-medium mb-2">Artist</h3>
            <p className="text-sm text-gray-400">
              Upload music, mint NFTs, and earn royalties from your creations.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-white"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-neon-green text-black hover:bg-neon-green/90"
            disabled={isLoading || !selectedRole}
          >
            {isLoading
              ? "Processing..."
              : existingUserData?.registered
              ? "Continue to Dashboard"
              : "Confirm Selection"}
          </Button>
        </div>

        {!existingUserData?.registered && (
          <p className="text-xs text-red-400 mt-4">
            Warning: Your role selection is permanent and cannot be changed once
            confirmed.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
