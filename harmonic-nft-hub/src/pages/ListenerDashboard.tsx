import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Navbar from "@/components/layout/Navbar";
import MusicNFTCard from "@/components/MusicNFTCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/context/web3context";
import { fetchOwnedNFTs, fetchListedNFTs, NFT } from "@/utils/contractHelpers";
import { Music, ArrowRight } from "lucide-react";
import MusicPlayer from "@/components/ui/MusicPlayer";

interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: {
    title: string;
    artist: string;
    audioUrl: string;
    imageUrl: string;
  } | null;
  audioElement: HTMLAudioElement | null;
}

const ListenerDashboard = () => {
  const { account, provider, role } = useWeb3();
  const navigate = useNavigate();
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  // Audio player state
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTrack: null,
    audioElement: null,
  });

  // Load NFT data
  useEffect(() => {
    const loadData = async () => {
      if (!provider) return;

      setIsLoading(true);
      try {
        // Fetch all listed NFTs
        const listed = await fetchListedNFTs(provider).catch((error) => {
          console.error("Error fetching listed NFTs:", error);
          return [];
        });
        setListedNFTs(listed);

        // If user is connected, fetch their owned NFTs
        if (account) {
          const owned = await fetchOwnedNFTs(provider, account).catch(
            (error) => {
              console.error("Error fetching owned NFTs:", error);
              return [];
            }
          );
          setOwnedNFTs(owned);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Loading Failed",
          description: "There was an error loading the dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [account, provider]);

  const processIPFSUrl = (url: string | undefined) => {
    if (!url) return null;
    return url.startsWith("ipfs://")
      ? `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`
      : url;
  };

  const handlePlayTrack = async (nft: NFT) => {
    if (!nft.metadata?.playbackUrl) {
      toast({
        title: "Playback Error",
        description: "No audio file available for this NFT.",
        variant: "destructive",
      });
      return;
    }

    const audioUrl = processIPFSUrl(nft.metadata.playbackUrl);
    const imageUrl = processIPFSUrl(nft.metadata.image);

    if (!audioUrl) {
      toast({
        title: "Playback Error",
        description: "Invalid audio file URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!audioState.audioElement) {
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setAudioState((prev) => ({ ...prev, isPlaying: false }));
        };
        setAudioState({
          audioElement: audio,
          currentTrack: {
            title: nft.title || nft.metadata.name || "Untitled",
            artist: nft.artist || nft.metadata.artist || "Unknown Artist",
            audioUrl,
            imageUrl: imageUrl || "/placeholder.svg",
          },
          isPlaying: true,
        });
        await audio.play();
      } else if (audioState.currentTrack?.audioUrl === audioUrl) {
        if (audioState.isPlaying) {
          audioState.audioElement.pause();
          setAudioState((prev) => ({ ...prev, isPlaying: false }));
        } else {
          await audioState.audioElement.play();
          setAudioState((prev) => ({ ...prev, isPlaying: true }));
        }
      } else {
        audioState.audioElement.src = audioUrl;
        await audioState.audioElement.play();
        setAudioState({
          audioElement: audioState.audioElement,
          currentTrack: {
            title: nft.title || nft.metadata.name || "Untitled",
            artist: nft.artist || nft.metadata.artist || "Unknown Artist",
            audioUrl,
            imageUrl: imageUrl || "/placeholder.svg",
          },
          isPlaying: true,
        });
      }
    } catch (error) {
      console.error("Playback error:", error);
      toast({
        title: "Playback Error",
        description: "Failed to play the audio file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Music NFT Marketplace</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse NFTs</TabsTrigger>
            <TabsTrigger value="collection">My Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <p>Loading NFTs...</p>
              ) : listedNFTs.length > 0 ? (
                listedNFTs.map((nft) => (
                  <MusicNFTCard
                    key={nft.id}
                    tokenId={nft.id}
                    metadata={nft.metadata}
                    title={nft.title}
                    artist={nft.artist}
                    totalShares={nft.totalShares}
                    sharesSold={nft.sharesSold}
                    price={nft.price}
                    isActive={nft.isActive}
                    fractionAddress={nft.fractionAddress}
                    onPlay={() => handlePlayTrack(nft)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No NFTs Listed</h3>
                  <p className="text-muted-foreground">
                    There are no music NFTs currently listed.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collection">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <p>Loading your collection...</p>
              ) : ownedNFTs.length > 0 ? (
                ownedNFTs.map((nft) => (
                  <MusicNFTCard
                    key={nft.id}
                    tokenId={nft.id}
                    metadata={nft.metadata}
                    title={nft.title}
                    artist={nft.artist}
                    totalShares={nft.totalShares}
                    sharesSold={nft.sharesSold}
                    price={nft.price}
                    isActive={nft.isActive}
                    fractionAddress={nft.fractionAddress}
                    onPlay={() => handlePlayTrack(nft)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No NFTs in Your Collection
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Browse and purchase NFTs to start your collection
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("browse")}
                    className="gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Browse NFTs
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {audioState.currentTrack && (
        <MusicPlayer
          isPlaying={audioState.isPlaying}
          currentTrack={audioState.currentTrack}
          onPlayPause={() => {
            if (audioState.audioElement && audioState.currentTrack) {
              const currentNFT = [...listedNFTs, ...ownedNFTs].find(
                (nft) =>
                  nft.metadata?.playbackUrl ===
                  audioState.currentTrack?.audioUrl
              );
              if (currentNFT) {
                handlePlayTrack(currentNFT);
              }
            }
          }}
          onStop={() => {
            if (audioState.audioElement) {
              audioState.audioElement.pause();
              audioState.audioElement.currentTime = 0;
              setAudioState((prev) => ({ ...prev, isPlaying: false }));
            }
          }}
        />
      )}
    </div>
  );
};

export default ListenerDashboard;
