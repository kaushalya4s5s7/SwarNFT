import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import MintForm from "@/components/mintform";
import MusicNFTCard from "@/components/MusicNFTCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/context/web3context";
import { fetchOwnedNFTs, NFT } from "@/utils/contractHelpers";
import {
  getTracksByArtist,
  getRecommendationsByTag,
  LastFmTrack,
} from "@/utils/lastfmAPI";
import { Music, Search, Upload } from "lucide-react";

const ArtistDashboard = () => {
  const { account, provider, signer, isCorrectNetwork } = useWeb3();
  const navigate = useNavigate();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [recommendations, setRecommendations] = useState<LastFmTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LastFmTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Load owned NFTs
  useEffect(() => {
    const loadOwnedNFTs = async () => {
      if (account && provider) {
        setIsLoading(true);
        try {
          const nfts = await fetchOwnedNFTs(provider, account);
          setOwnedNFTs(nfts);
        } catch (error) {
          console.error("Error loading NFTs:", error);
          toast({
            title: "Failed to Load NFTs",
            description:
              "There was an error loading your NFTs. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOwnedNFTs();
  }, [account, provider]);

  // Load initial recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const tracks = await getRecommendationsByTag("pop", 8);
        setRecommendations(tracks);
      } catch (error) {
        console.error("Error loading recommendations:", error);
      }
    };

    loadRecommendations();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await getTracksByArtist(searchQuery, 12);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching tracks:", error);
      toast({
        title: "Search Failed",
        description:
          "There was an error searching for tracks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Refresh NFTs after minting
  const refreshNFTs = async () => {
    if (account && provider) {
      const nfts = await fetchOwnedNFTs(provider, account);
      setOwnedNFTs(nfts);
      setShowUploadForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-neon-green">
          Artist Dashboard
        </h1>

        {/* Upload Section */}
        <section className="mb-12">
          <Card className="bg-black border border-neon-green/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Create Music NFT</CardTitle>
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="gap-2 bg-neon-green text-black hover:bg-neon-green/90"
              >
                <Upload className="h-4 w-4" />
                Upload & Mint Music
              </Button>
            </CardHeader>
            <CardContent>
              {showUploadForm && (
                <div className="py-4">
                  <MintForm onMintSuccess={refreshNFTs} />
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-medium mb-4 text-neon-green">
                  Find Existing Music
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by artist name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="bg-black border-neon-green/30 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="gap-2 bg-neon-green text-black hover:bg-neon-green/90"
                  >
                    <Search className="h-4 w-4" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4 text-neon-green">
                    Search Results
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((track) => (
                      <Card
                        key={`${track.artist.name}-${track.name}`}
                        className="bg-black border border-neon-green/30"
                      >
                        <div className="p-4">
                          <p className="font-medium text-white line-clamp-1">
                            {track.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {track.artist.name}
                          </p>
                        </div>
                        <CardContent className="pt-0 pb-4 px-4 flex justify-end">
                          <MintForm track={track} onMintSuccess={refreshNFTs} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {!searchResults.length && !isSearching && !showUploadForm && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4 text-neon-green">
                    Recommended Tracks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendations.map((track) => (
                      <Card
                        key={`${track.artist.name}-${track.name}`}
                        className="bg-black border border-neon-green/30"
                      >
                        <div className="p-4">
                          <p className="font-medium text-white line-clamp-1">
                            {track.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {track.artist.name}
                          </p>
                        </div>
                        <CardContent className="pt-0 pb-4 px-4 flex justify-end">
                          <MintForm track={track} onMintSuccess={refreshNFTs} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* My NFTs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-neon-green">
            My Music NFTs
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-white">
              <p>Loading your NFTs...</p>
            </div>
          ) : ownedNFTs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {ownedNFTs.map((nft) => (
                <MusicNFTCard
                  key={nft.id}
                  tokenId={nft.id}
                  metadata={
                    nft.metadata || {
                      name: `NFT #${nft.id}`,
                      description: "No metadata available",
                      image: "/placeholder.svg",
                      artist: "Unknown Artist",
                      playbackUrl: "",
                    }
                  }
                  title={nft.title}
                  artist={nft.artist}
                  totalShares={nft.totalShares}
                  sharesSold={nft.sharesSold}
                  price={nft.price}
                  isActive={nft.isActive}
                  fractionAddress={nft.fractionAddress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-neon-green/30 rounded-lg">
              <Music className="h-12 w-12 mx-auto text-neon-green mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">
                No NFTs Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Upload and mint your first music NFT to get started
              </p>
              <Button
                onClick={() => setShowUploadForm(true)}
                className="gap-2 bg-neon-green text-black hover:bg-neon-green/90"
              >
                <Upload className="h-4 w-4" />
                Upload Music
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-green/30 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-gray-400">
          <p>© 2025 Music Monkeys Crypto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArtistDashboard;
