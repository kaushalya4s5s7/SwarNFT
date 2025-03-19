import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMusicStart,
  fetchTrendingSuccess,
} from "@/features/music/musicSlice";
import MusicCard from "@/components/ui/MusicCard";
import { NFT } from "@/types";

// Sample data for trending NFTs
const mockTrendingNFTs: NFT[] = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "CyberWave",
    imageUrl: "public/lovable-uploads/48ef3d34-afe7-4411-97f5-a44fa963a2a3.png",
    audioUrl:
      "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_08_-_Deeper.mp3",
    price: 0.15,
    totalShares: 100,
    availableShares: 65,
    owners: [{ address: "0x123", shares: 35 }],
  },
  {
    id: "2",
    title: "Digital Horizon",
    artist: "Meta Wave",
    imageUrl: "public/lovable-uploads/d56bcc93-ae76-4513-9bd9-d789c36a8b79.png",
    audioUrl:
      "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_03_-_Fast_Life.mp3",
    price: 0.25,
    totalShares: 100,
    availableShares: 42,
    owners: [{ address: "0x456", shares: 58 }],
  },
  {
    id: "3",
    title: "Future Beats",
    artist: "Neural Pulse",
    imageUrl: "public/lovable-uploads/8c7e7287-0697-4c84-9b2f-9a9b2df0de1c.png",
    audioUrl:
      "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_07_-_Memories_Renewed.mp3",
    price: 0.18,
    totalShares: 100,
    availableShares: 73,
    owners: [{ address: "0x789", shares: 27 }],
  },
];

const TrendingSection = () => {
  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state: any) => state.music);

  useEffect(() => {
    dispatch(fetchMusicStart());

    // Simulate API call with mock data
    setTimeout(() => {
      dispatch(fetchTrendingSuccess(mockTrendingNFTs));
    }, 1000);
  }, [dispatch]);

  return (
    <section className="page-section" id="trending">
      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="heading-lg text-white mb-12">Trending Music NFTs</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="glass-card h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trending.map((nft: NFT, index: number) => (
                <MusicCard key={nft.id} nft={nft} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
