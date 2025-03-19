
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MusicCard from '@/components/ui/MusicCard';
import MusicPlayer from '@/components/ui/MusicPlayer';
import { fetchMusicStart, fetchTrendingSuccess } from '@/features/music/musicSlice';
import { NFT } from '@/types';

// Sample data for trending NFTs (additional items)
const mockTrendingNFTs: NFT[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'CyberWave',
    imageUrl: 'public/lovable-uploads/48ef3d34-afe7-4411-97f5-a44fa963a2a3.png',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_08_-_Deeper.mp3',
    price: 0.15,
    totalShares: 100,
    availableShares: 65,
    owners: [{ address: '0x123', shares: 35 }]
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'Meta Wave',
    imageUrl: 'public/lovable-uploads/d56bcc93-ae76-4513-9bd9-d789c36a8b79.png',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_03_-_Fast_Life.mp3',
    price: 0.25,
    totalShares: 100,
    availableShares: 42,
    owners: [{ address: '0x456', shares: 58 }]
  },
  {
    id: '3',
    title: 'Future Beats',
    artist: 'Neural Pulse',
    imageUrl: 'public/lovable-uploads/8c7e7287-0697-4c84-9b2f-9a9b2df0de1c.png',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_07_-_Memories_Renewed.mp3',
    price: 0.18,
    totalShares: 100,
    availableShares: 73,
    owners: [{ address: '0x789', shares: 27 }]
  },
  {
    id: '4',
    title: 'Crypto Rhythm',
    artist: 'BlockBeats',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1074&auto=format&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_04_-_Life_Illusion.mp3',
    price: 0.21,
    totalShares: 100,
    availableShares: 55,
    owners: [{ address: '0xabc', shares: 45 }]
  },
  {
    id: '5',
    title: 'Ethereal Voyage',
    artist: 'Quantum Sound',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1170&auto=format&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_01_-_Remembering.mp3',
    price: 0.32,
    totalShares: 100,
    availableShares: 28,
    owners: [{ address: '0xdef', shares: 72 }]
  },
  {
    id: '6',
    title: 'Blockchain Beats',
    artist: 'Crypto Composer',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1170&auto=format&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_02_-_Falling_Stars.mp3',
    price: 0.17,
    totalShares: 100,
    availableShares: 82,
    owners: [{ address: '0xghi', shares: 18 }]
  },
];

const Trending = () => {
  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state: any) => state.music);

  useEffect(() => {
    dispatch(fetchMusicStart());
    
    // Simulate API call with mock data
    setTimeout(() => {
      dispatch(fetchTrendingSuccess(mockTrendingNFTs));
    }, 1000);
  }, [dispatch]);

  const categories = ['All', 'Electronic', 'Hip Hop', 'Ambient', 'Rock', 'Jazz'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 pt-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-lg text-white"
          >
            Trending Music NFTs
          </motion.h1>
        </header>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Search by artist, title, or keyword" 
                className="pl-10 bg-black/20 border-white/10 focus-visible:ring-neon-green"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-neon-green text-black hover:bg-neon-green/90" : "border-white/10 hover:border-neon-green/50 text-white"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
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
        </section>

        <section className="mt-20 mb-12">
          <h2 className="heading-md text-white mb-8">New Releases</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="glass-card h-60 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {trending.slice(0, 4).map((nft: NFT, index: number) => (
                <MusicCard key={`new-${nft.id}`} nft={nft} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
      
      <MusicPlayer />
    </motion.div>
  );
};

export default Trending;
