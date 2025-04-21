import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/context/web3context";
import { mintNFT } from "@/utils/contractHelpers";
import { formatTrackAsNFTMetadata } from "@/utils/lastfmAPI";
import { toast } from "@/components/ui/use-toast";
import { Music, Upload, Play, Pause } from "lucide-react";
import { LastFmTrack } from "@/utils/lastfmAPI";
import {
  uploadToIPFS,
  uploadToIPFSWithRetry,
  getIPFSUrl,
  checkIPFSGateway,
} from "@/utils/ipfsConfig";

interface MintFormProps {
  track?: LastFmTrack;
  onMintSuccess?: () => void;
}

const MintForm: React.FC<MintFormProps> = ({ track, onMintSuccess }) => {
  const { signer, isCorrectNetwork } = useWeb3();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fractionalize, setFractionalize] = useState(true);
  const [fractionSupply, setFractionSupply] = useState(1000);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const [fractionAddress, setFractionAddress] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("0.01");

  // State for music upload
  const [title, setTitle] = useState(track ? track.name : "");
  const [artist, setArtist] = useState(track ? track.artist.name : "");
  const [description, setDescription] = useState("");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<"info" | "mint">(
    track ? "mint" : "info"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [musicIpfsHash, setMusicIpfsHash] = useState<string | null>(null);
  const [imageIpfsHash, setImageIpfsHash] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    music: number;
    image: number;
  }>({ music: 0, image: 0 });

  const musicFileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleMusicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMusicFile(file);
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Create audio element for playing preview
      const audio = new Audio(url);
      audio.onended = () => setAudioPlaying(false);
      setAudioElement(audio);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioElement) return;

    if (audioPlaying) {
      audioElement.pause();
      setAudioPlaying(false);
    } else {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
        toast({
          title: "Audio Error",
          description:
            "Could not play the audio file. Please check the file format.",
          variant: "destructive",
        });
      });
      setAudioPlaying(true);
    }
  };

  const continueToMint = async () => {
    if (!title || !artist || !musicFile) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields and upload a music file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Check IPFS gateway first
      const isGatewayAccessible = await checkIPFSGateway();
      if (!isGatewayAccessible) {
        throw new Error(
          "IPFS gateway is not accessible. Please try again later."
        );
      }

      // Upload music file with retry
      setUploadProgress((prev) => ({ ...prev, music: 10 }));
      const musicHash = await uploadToIPFSWithRetry(musicFile);
      setMusicIpfsHash(musicHash);
      setUploadProgress((prev) => ({ ...prev, music: 100 }));

      // Upload cover image if present
      if (coverImage) {
        setUploadProgress((prev) => ({ ...prev, image: 10 }));
        const imageHash = await uploadToIPFSWithRetry(coverImage);
        setImageIpfsHash(imageHash);
        setUploadProgress((prev) => ({ ...prev, image: 100 }));
      }

      toast({
        title: "Files Uploaded Successfully",
        description: "Your files have been uploaded to IPFS.",
      });

      setUploadStep("mint");
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      toast({
        title: "Upload Failed",
        description:
          error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({ music: 0, image: 0 });
    }
  };

  const handleMint = async () => {
    if (!signer || !isCorrectNetwork) {
      toast({
        title: "Network Error",
        description:
          "Please connect your wallet and switch to Sepolia network.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !artist || !musicIpfsHash) {
      toast({
        title: "Missing Information",
        description: "Please complete the upload step first.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    try {
      // Create and upload metadata
      const metadata = {
        name: title,
        description: description || `${title} by ${artist}`,
        image: imageIpfsHash ? `ipfs://${imageIpfsHash}` : "/placeholder.svg",
        artist: artist,
        playbackUrl: `ipfs://${musicIpfsHash}`,
        attributes: [
          {
            trait_type: "Artist",
            value: artist,
          },
          {
            trait_type: "Type",
            value: "Music NFT",
          },
        ],
      };

      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const metadataFile = new File([metadataBlob], "metadata.json");

      // Upload metadata with retry
      const metadataHash = await uploadToIPFSWithRetry(metadataFile);
      const metadataURI = `ipfs://${metadataHash}`;

      // Convert price from ETH to wei
      const priceInWei = ethers.parseEther(price);

      // Mint NFT with fractionalization
      const totalShares = fractionalize ? fractionSupply : 1;
      const tokenId = await mintNFT(
        signer,
        title,
        artist,
        totalShares,
        priceInWei,
        metadataURI
      );

      if (tokenId !== null) {
        setMintedTokenId(tokenId);
        toast({
          title: "NFT Minted Successfully",
          description: `Your music NFT "${title}" has been minted with ID ${tokenId}`,
        });

        if (onMintSuccess) {
          onMintSuccess();
        }
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const renderUploadProgress = () => {
    if (!isUploading) return null;

    return (
      <div className="mt-4 space-y-2">
        {uploadProgress.music > 0 && (
          <div className="space-y-1">
            <p className="text-sm">Uploading music file...</p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress.music}%` }}
              />
            </div>
          </div>
        )}
        {uploadProgress.image > 0 && (
          <div className="space-y-1">
            <p className="text-sm">Uploading cover image...</p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress.image}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Music className="h-4 w-4" />
        {track ? "Mint As NFT" : "Upload & Mint"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {uploadStep === "info" ? "Upload Music" : "Mint Music NFT"}
            </DialogTitle>
          </DialogHeader>

          {uploadStep === "info" ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Song title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Artist name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of your music"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="musicFile">Music File</Label>
                <div className="flex gap-2">
                  <Input
                    id="musicFile"
                    type="file"
                    accept="audio/*"
                    ref={musicFileRef}
                    className="hidden"
                    onChange={handleMusicFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => musicFileRef.current?.click()}
                    className="flex-1"
                  >
                    Select Music File
                  </Button>
                  {previewUrl && (
                    <Button
                      variant="secondary"
                      size="icon"
                      type="button"
                      onClick={toggleAudioPlayback}
                    >
                      {audioPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {musicFile && (
                  <p className="text-sm text-muted-foreground">
                    {musicFile.name}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coverImage">Cover Image (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    ref={imageFileRef}
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => imageFileRef.current?.click()}
                    className="flex-1"
                  >
                    Select Cover Image
                  </Button>
                </div>
                {imagePreviewUrl && (
                  <div className="mt-2">
                    <img
                      src={imagePreviewUrl}
                      alt="Cover preview"
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {renderUploadProgress()}

              <CardFooter className="flex justify-between p-0 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={continueToMint}
                  disabled={isUploading || !musicFile}
                >
                  {isUploading ? "Uploading..." : "Continue to Mint"}
                </Button>
              </CardFooter>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{artist}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt={title}
                        className="h-40 w-40 object-cover rounded-lg"
                      />
                    ) : track && track.image && track.image.length > 0 ? (
                      <img
                        src={
                          track.image[track.image.length - 1]["#text"] ||
                          "/placeholder.svg"
                        }
                        alt={title}
                        className="h-40 w-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-40 w-40 flex items-center justify-center rounded-lg bg-secondary">
                        <Music className="h-16 w-16 text-secondary-foreground opacity-50" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Price per share (ETH)
                </label>
                <Input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.01"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={fractionalize}
                    onChange={(e) => setFractionalize(e.target.checked)}
                    className="mr-2"
                  />
                  Create Fractional Ownership
                </label>

                {fractionalize && (
                  <div className="grid gap-2">
                    <label
                      htmlFor="fractionSupply"
                      className="text-sm font-medium"
                    >
                      Number of Fractions
                    </label>
                    <Input
                      id="fractionSupply"
                      type="number"
                      value={fractionSupply}
                      onChange={(e) =>
                        setFractionSupply(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      min="1"
                      max="1000000"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-secondary/40 rounded-md text-sm">
                <p>
                  <strong>Files uploaded to IPFS:</strong>
                </p>
                {musicIpfsHash && (
                  <p className="truncate">Music file: ipfs://{musicIpfsHash}</p>
                )}
                {imageIpfsHash && (
                  <p className="truncate">
                    Cover image: ipfs://{imageIpfsHash}
                  </p>
                )}
              </div>

              <CardFooter className="flex justify-between p-0 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep("info")}
                  disabled={isMinting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleMint}
                  disabled={
                    !signer || !isCorrectNetwork || isMinting || !musicIpfsHash
                  }
                  className="gap-2"
                >
                  {isMinting ? (
                    "Minting..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Mint NFT
                    </>
                  )}
                </Button>
              </CardFooter>
            </div>
          )}

          {!isCorrectNetwork && signer && (
            <p className="text-sm text-destructive text-center mt-2">
              Please switch to the Sepolia network to mint NFTs.
            </p>
          )}

          {mintedTokenId && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <h3 className="font-medium">NFT Minted Successfully!</h3>
              <p className="text-sm mt-1">Token ID: {mintedTokenId}</p>
              {fractionAddress && (
                <p className="text-sm mt-1">
                  Fraction Address: {fractionAddress}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MintForm;
