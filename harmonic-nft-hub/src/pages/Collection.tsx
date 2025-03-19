
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Grid2X2, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MusicCard from '@/components/ui/MusicCard';
import MusicPlayer from '@/components/ui/MusicPlayer';
import { fetchMusicStart, fetchCollectionSuccess } from '@/features/music/musicSlice';
import { NFT } from '@/types';

// Sample data for collection NFTs
const mockCollectionNFTs: NFT[] = [
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

const Collection = () => {
  const dispatch = useDispatch();
  const { collection, loading } = useSelector((state: any) => state.music);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [priceRange, setPriceRange] = useState([0, 0.5]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchMusicStart());
    
    // Simulate API call with mock data
    setTimeout(() => {
      dispatch(fetchCollectionSuccess(mockCollectionNFTs));
    }, 1000);
  }, [dispatch]);

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
            NFT Collection
          </motion.h1>
        </header>

        <section className="mb-12">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <TabsList className="bg-black/20 border border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">All NFTs</TabsTrigger>
                <TabsTrigger value="owned" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">Owned</TabsTrigger>
                <TabsTrigger value="available" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">Available</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:border-white/20"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="border-white/10 hover:border-white/20">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                <Button variant="outline" size="icon" className="border-white/10 hover:border-white/20">
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 mb-8"
              >
                <h3 className="text-white font-medium mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-3">Price Range (ETH)</h4>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{priceRange[0]} ETH</span>
                        <span>{priceRange[1]} ETH</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {['Electronic', 'Hip Hop', 'Ambient', 'Rock', 'Jazz'].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Switch id={`filter-${category}`} />
                          <Label htmlFor={`filter-${category}`} className="text-gray-300 text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-400 mb-3">Availability</h4>
                    <div className="space-y-2">
                      {['Full Ownership', 'Fractional', 'New Releases', 'Limited Edition'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Switch id={`filter-${option}`} />
                          <Label htmlFor={`filter-${option}`} className="text-gray-300 text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button size="sm" variant="outline" className="border-white/10 mr-2">
                    Reset
                  </Button>
                  <Button size="sm" className="bg-neon-green text-black">
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}

            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <div key={i} className="glass-card h-72 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collection.map((nft: NFT, index: number) => (
                    <MusicCard key={nft.id} nft={nft} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="owned" className="mt-0">
              {!isAuthenticated ? (
                <div className="neo-blur p-10 text-center">
                  <h3 className="text-xl text-white mb-4">Connect Wallet to View Your Collection</h3>
                  <p className="text-gray-400 mb-6">
                    You need to connect your wallet to view the NFTs you own.
                  </p>
                  <Button className="bg-neon-green text-black hover:bg-neon-green/90">
                    Connect Wallet
                  </Button>
                </div>
              ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="glass-card h-72 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collection.slice(0, 2).map((nft: NFT, index: number) => (
                    <MusicCard key={`owned-${nft.id}`} nft={nft} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="available" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="glass-card h-72 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collection.slice(2).map((nft: NFT, index: number) => (
                    <MusicCard key={`available-${nft.id}`} nft={nft} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
      
      <MusicPlayer />
    </motion.div>
  );
};

export default Collection;
