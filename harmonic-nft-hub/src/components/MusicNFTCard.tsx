import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWeb3 } from "@/context/web3context";
import {
  buyShares,
  getSharesOwned,
  NFTMetadata,
} from "@/utils/contractHelpers";
import { toast } from "@/components/ui/use-toast";
import { Play, Pause, Music, Lock } from "lucide-react";
import { ethers } from "ethers";

// Add this helper function at the top of the file
const processIPFSUrl = (url: string) => {
  if (!url) return null;
  return url.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`
    : url;
};

interface MusicNFTCardProps {
  tokenId: number;
  metadata: NFTMetadata;
  title?: string;
  artist?: string;
  totalShares?: number;
  sharesSold?: number;
  price?: bigint;
  isActive?: boolean;
  fractionAddress?: string;
  onPlay?: () => void;
}

const MusicNFTCard: React.FC<MusicNFTCardProps> = ({
  tokenId,
  metadata,
  title,
  artist,
  totalShares = 100,
  sharesSold = 0,
  price = BigInt(0),
  isActive = true,
  fractionAddress,
  onPlay,
}) => {
  const { account, provider, signer, isCorrectNetwork } = useWeb3();
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [userShares, setUserShares] = useState(0);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string>("/placeholder.svg");

  // Process IPFS URLs
  useEffect(() => {
    if (metadata) {
      // Process playback URL
      const processedPlaybackUrl = processIPFSUrl(metadata.playbackUrl);
      if (processedPlaybackUrl) {
        setPlaybackUrl(processedPlaybackUrl);
      }

      // Process image URL
      const processedImageUrl = processIPFSUrl(metadata.image);
      if (processedImageUrl) {
        setDisplayImage(processedImageUrl);
      }
    }
  }, [metadata]);

  // Check if user owns shares
  useEffect(() => {
    const checkShareOwnership = async () => {
      if (account && provider && isCorrectNetwork) {
        try {
          const shares = await getSharesOwned(provider, tokenId, account);
          setUserShares(shares);
          setCanPlay(shares > 0);
        } catch (error) {
          console.error("Error checking share ownership:", error);
          setCanPlay(false);
        }
      } else {
        setCanPlay(false);
      }
    };

    checkShareOwnership();
  }, [account, provider, tokenId, isCorrectNetwork]);

  // Handle audio initialization
  useEffect(() => {
    if (playbackUrl && canPlay) {
      const audio = new Audio(playbackUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [playbackUrl, canPlay]);

  const handleBuyShares = async () => {
    if (!signer || !isCorrectNetwork) {
      toast({
        title: "Connection Error",
        description:
          "Please connect your wallet and ensure you're on the correct network.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await buyShares(signer, tokenId, sharesToBuy, price);
      if (success) {
        toast({
          title: "Purchase Successful",
          description: `Successfully purchased ${sharesToBuy} shares!`,
        });
        // Update shares owned
        const newShares = await getSharesOwned(provider!, tokenId, account!);
        setUserShares(newShares);
        setCanPlay(newShares > 0);
        setBuyDialogOpen(false);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description:
          error.message || "Failed to purchase shares. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audioElement || !canPlay) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description:
            "There was an error playing this track. Please try again.",
          variant: "destructive",
        });
      });

      if (onPlay) onPlay();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className="aspect-square relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${displayImage})`,
        }}
      >
        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-0 hover:opacity-100">
          {canPlay ? (
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 cursor-not-allowed opacity-70"
              onClick={() => setBuyDialogOpen(true)}
            >
              <Lock className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base line-clamp-1">
          {title || metadata?.name || "Untitled Track"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-1">
          {artist || metadata?.artist || "Unknown Artist"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 justify-between">
        {canPlay ? (
          <Button
            variant="default"
            size="sm"
            className="w-full gap-2"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => setBuyDialogOpen(true)}
          >
            <Lock className="h-4 w-4" />
            Get Access
          </Button>
        )}
        <div className="text-xs text-muted-foreground w-full">
                    <p>Total Shares: {totalShares}</p>
          <p>Shares Remaining: {totalShares - sharesSold}</p>
          {userShares > 0 && <p>Your Shares: {userShares}</p>};
        </div>
      </CardFooter>

      {/* Buy Access Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Access to This Music NFT</DialogTitle>
            <DialogDescription>
              Purchase shares to gain access to "{title || metadata?.name}" by{" "}
              {artist || metadata?.artist}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-center p-4">
              <img
                src={displayImage}
                alt={title || metadata?.name}
                className="h-40 w-40 object-cover rounded-lg"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Number of Shares to Buy
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                max={totalShares - sharesSold}
                value={sharesToBuy}
                onChange={(e) =>
                  setSharesToBuy(
                    Math.max(
                      1,
                      Math.min(
                        totalShares - sharesSold,
                        parseInt(e.target.value) || 1
                      )
                    )
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Price per share: {ethers.formatEther(price)} ETH
              </p>
              <p className="text-sm text-muted-foreground">
                Total price:{" "}
                {(Number(ethers.formatEther(price)) * sharesToBuy).toFixed(5)}{" "}
                ETH
              </p>
            </div>

            <Button
              onClick={handleBuyShares}
              disabled={!account || !isCorrectNetwork || isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Buy Now"}
            </Button>

            {!account && (
              <p className="text-sm text-destructive text-center">
                Please connect your wallet first.
              </p>
            )}

            {account && !isCorrectNetwork && (
              <p className="text-sm text-destructive text-center">
                Please switch to the Sepolia network.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MusicNFTCard;
7;
