
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Wallet, Music2, LineChart, Settings, LogOut, Heart, Clock, Share2, Headphones, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MusicCard from '@/components/ui/MusicCard';
import MusicPlayer from '@/components/ui/MusicPlayer';
import { NFT } from '@/types';
import { logout } from '@/features/auth/authSlice';

// Mock data for owned NFTs
const ownedNFTs: NFT[] = [
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
];

// Mock data for recommended NFTs
const recommendedNFTs: NFT[] = [
  {
    id: '3',
    title: 'Cyber Pulse',
    artist: 'Quantum Beats',
    imageUrl: 'public/lovable-uploads/c8a47b45-8f51-4f1d-9edf-44881a2d0586.png',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_13_-_Remembering.mp3',
    price: 0.18,
    totalShares: 100,
    availableShares: 82,
    owners: [{ address: '0x789', shares: 18 }]
  },
  {
    id: '4',
    title: 'Electric Soul',
    artist: 'Neural Network',
    imageUrl: 'public/lovable-uploads/8c7e7287-0697-4c84-9b2f-9a9b2df0de1c.png',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_04_-_Ripples.mp3',
    price: 0.22,
    totalShares: 100,
    availableShares: 75,
    owners: [{ address: '0xabc', shares: 25 }]
  }
];

const ListenerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);
  const { address } = useSelector((state: any) => state.wallet);
  const [activeTab, setActiveTab] = useState('collection');
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [shareAmount, setShareAmount] = useState(1);

  useEffect(() => {
    // Redirect if not authenticated or not a listener
    if (!isAuthenticated || role !== 'listener') {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role !== 'listener') {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handlePurchase = (nft: NFT) => {
    setSelectedNFT(nft);
    setShareAmount(1);
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedNFT) {
      const totalCost = selectedNFT.price * shareAmount;
      toast.success(`Successfully purchased ${shareAmount} shares of "${selectedNFT.title}" for ${totalCost.toFixed(2)} ETH`);
      setPurchaseDialogOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="neo-blur p-6 sticky top-32">
              <div className="text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-neon-green/30 to-purple-500/30 mx-auto mb-4 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-medium text-white">Listener Dashboard</h2>
                <div className="text-gray-400 text-sm mt-1 break-all">
                  {address && address.substring(0, 6) + '...' + address.substring(address.length - 4)}
                </div>
              </div>

              <nav className="space-y-2 mb-8">
                <button 
                  onClick={() => setActiveTab('collection')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'collection' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <Music2 className="h-4 w-4 mr-3" />
                  My Collection
                </button>
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'discover' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Discover
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'analytics' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <LineChart className="h-4 w-4 mr-3" />
                  Analytics
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'settings' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
              </nav>

              <Button
                variant="outline"
                className="w-full border-white/10 hover:border-red-500/50 text-gray-300 hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <header className="mb-10">
              <h1 className="heading-md text-white mb-2">Welcome to Your Dashboard</h1>
              <p className="text-gray-400">
                Manage your music NFT collection and track your portfolio performance.
              </p>
            </header>

            {activeTab === 'collection' && (
              <>
                <Tabs defaultValue="collection" className="mb-10">
                  <TabsList className="bg-black/20 border border-white/10">
                    <TabsTrigger value="collection" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      My Collection
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      History
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="collection" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {ownedNFTs.map((nft, index) => (
                        <MusicCard key={nft.id} nft={nft} index={index} />
                      ))}
                    </div>
                    
                    <div className="mt-10 glass-card p-8">
                      <h3 className="text-lg font-medium text-white mb-6">Portfolio Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-4">
                          <p className="text-gray-400 text-sm mb-1">Total Value</p>
                          <p className="text-2xl font-bold text-white">0.40 ETH</p>
                        </div>
                        <div className="glass-card p-4">
                          <p className="text-gray-400 text-sm mb-1">NFTs Owned</p>
                          <p className="text-2xl font-bold text-white">2</p>
                        </div>
                        <div className="glass-card p-4">
                          <p className="text-gray-400 text-sm mb-1">Total Fractional Shares</p>
                          <p className="text-2xl font-bold text-white">93</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="mt-6">
                    <div className="neo-blur p-10 text-center">
                      <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Favorites Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Music you mark as favorite will appear here.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('discover')}
                        className="bg-neon-green hover:bg-neon-green/90 text-black"
                      >
                        Discover Music
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-6">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-medium text-white mb-4">Transaction History</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border-b border-white/10">
                          <div>
                            <p className="text-white font-medium">Purchased "Neon Dreams"</p>
                            <p className="text-gray-400 text-sm">From: CyberWave</p>
                          </div>
                          <div className="text-right">
                            <p className="text-neon-green">0.15 ETH</p>
                            <p className="text-gray-400 text-sm">March 10, 2023</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-white/10">
                          <div>
                            <p className="text-white font-medium">Purchased "Digital Horizon"</p>
                            <p className="text-gray-400 text-sm">From: Meta Wave</p>
                          </div>
                          <div className="text-right">
                            <p className="text-neon-green">0.25 ETH</p>
                            <p className="text-gray-400 text-sm">February 28, 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <section className="mb-10">
                  <h2 className="text-xl font-medium text-white mb-6">Recent Activity</h2>
                  <div className="glass-card p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Headphones className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white">You listened to "Neon Dreams"</p>
                          <p className="text-gray-400 text-sm">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Wallet className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white">"Digital Horizon" received 0.02 ETH in royalties</p>
                          <p className="text-gray-400 text-sm">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Share2 className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white">You shared "Digital Horizon" on social media</p>
                          <p className="text-gray-400 text-sm">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'discover' && (
              <section className="mb-10">
                <h2 className="text-xl font-medium text-white mb-6">Discover New Music</h2>
                
                <div className="glass-card p-6 mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Recommended For You</h3>
                  <p className="text-gray-400 text-sm mb-6">Based on your listening history and collection</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recommendedNFTs.map((nft, index) => (
                      <div key={nft.id} className="glass-card overflow-hidden">
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={nft.imageUrl} 
                            alt={nft.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                            <div>
                              <h4 className="text-white font-medium">{nft.title}</h4>
                              <p className="text-gray-300 text-sm">{nft.artist}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Price per share</p>
                              <p className="text-neon-green font-medium">{nft.price} ETH</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Available</p>
                              <p className="text-white font-medium">{nft.availableShares}/{nft.totalShares} shares</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handlePurchase(nft)}
                            className="w-full bg-neon-green hover:bg-neon-green/90 text-black"
                          >
                            Buy Shares
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Trending Now</h3>
                  <p className="text-gray-400 text-sm mb-6">Popular tracks on the platform</p>
                  
                  <div className="space-y-4">
                    {[...ownedNFTs, ...recommendedNFTs].slice(0, 3).map((track, index) => (
                      <div key={track.id} className="flex items-center justify-between p-3 glass-card">
                        <div className="flex items-center">
                          <div className="w-12 h-12 mr-3 rounded-md overflow-hidden">
                            <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{track.title}</p>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-neon-green/50 text-white hover:text-neon-green">
                            <Headphones className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/10 hover:border-neon-green/50 text-white hover:text-neon-green">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handlePurchase(track)}
                            size="sm" 
                            className="bg-neon-green hover:bg-neon-green/90 text-black"
                          >
                            Buy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'analytics' && (
              <section className="mb-10">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium text-white mb-6">Your Collection Analytics</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-white mb-4">Portfolio Growth</h3>
                    <div className="glass-card aspect-video relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-400 mb-2">Value Over Time</p>
                          <div className="h-40 flex items-end space-x-2 justify-center">
                            {[30, 45, 25, 60, 40, 80, 70].map((height, i) => (
                              <div 
                                key={i} 
                                className="w-8 bg-gradient-to-t from-neon-green to-purple-500/50 rounded-t-sm"
                                style={{ height: `${height}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-between text-gray-500 text-xs mt-2 px-4">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-4">
                      <h4 className="text-md font-medium text-white mb-3">Ownership Breakdown</h4>
                      <div className="flex justify-center mt-4">
                        <div className="w-32 h-32 rounded-full border-8 border-gray-800 relative">
                          <div 
                            className="absolute inset-0 rounded-full border-8 border-t-neon-green border-r-neon-green border-transparent"
                            style={{ transform: 'rotate(45deg)' }}
                          ></div>
                          <div 
                            className="absolute inset-0 rounded-full border-8 border-b-purple-500 border-l-purple-500 border-transparent"
                            style={{ transform: 'rotate(45deg)' }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold">93</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-neon-green rounded-full mr-2"></div>
                          <span className="text-gray-300">Neon Dreams (38%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Digital Horizon (62%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h4 className="text-md font-medium text-white mb-3">Royalty Earnings</h4>
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-neon-green">0.012</p>
                          <p className="text-gray-400 mt-1">ETH earned this month</p>
                          <p className="text-xs text-gray-500 mt-4">+22% from last month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h4 className="text-md font-medium text-white mb-3">Activity Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 border-b border-white/5">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">Listening Time</span>
                        </div>
                        <span className="text-white">12.5 hours</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-white/5">
                        <div className="flex items-center">
                          <Music2 className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">Tracks Played</span>
                        </div>
                        <span className="text-white">47</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-white/5">
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">Shares Generated</span>
                        </div>
                        <span className="text-white">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'settings' && (
              <section className="mb-10">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="glass-card p-4">
                      <h3 className="text-md font-medium text-white mb-4">Display Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">Dark Mode</p>
                          <div className="w-12 h-6 bg-neon-green rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">Animations</p>
                          <div className="w-12 h-6 bg-neon-green rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">Autoplay</p>
                          <div className="w-12 h-6 bg-white/20 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h3 className="text-md font-medium text-white mb-4">Notification Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">Price Alerts</p>
                          <div className="w-12 h-6 bg-neon-green rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">New Releases</p>
                          <div className="w-12 h-6 bg-neon-green rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300">Royalty Payments</p>
                          <div className="w-12 h-6 bg-neon-green rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h3 className="text-md font-medium text-white mb-4">Connected Accounts</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <span className="text-blue-400 font-bold">T</span>
                            </div>
                            <p className="text-gray-300">Twitter</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-white/10 text-white hover:border-neon-green/50 hover:text-neon-green">
                            Connect
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <span className="text-purple-400 font-bold">D</span>
                            </div>
                            <p className="text-gray-300">Discord</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-white/10 text-white hover:border-neon-green/50 hover:text-neon-green">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="bg-black border border-neon-green/30 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Purchase Shares</DialogTitle>
          </DialogHeader>

          {selectedNFT && (
            <form onSubmit={handlePurchaseSubmit}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img src={selectedNFT.imageUrl} alt={selectedNFT.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedNFT.title}</h3>
                  <p className="text-gray-400 text-sm">by {selectedNFT.artist}</p>
                </div>
              </div>
              
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="shares" className="block text-sm font-medium text-gray-400 mb-1">
                    Number of Shares
                  </label>
                  <Input
                    id="shares"
                    type="number"
                    min="1"
                    max={selectedNFT.availableShares}
                    value={shareAmount}
                    onChange={(e) => setShareAmount(parseInt(e.target.value))}
                    className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                    required
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {selectedNFT.availableShares} shares available of {selectedNFT.totalShares} total
                  </p>
                </div>
                
                <div className="glass-card p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per Share:</span>
                    <span className="text-white">{selectedNFT.price} ETH</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white">{shareAmount}</span>
                  </div>
                  <div className="border-t border-white/10 my-2 pt-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200 font-medium">Total:</span>
                    <span className="text-neon-green font-bold">{(selectedNFT.price * shareAmount).toFixed(2)} ETH</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setPurchaseDialogOpen(false)} className="border-gray-700 text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                  Confirm Purchase
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      <MusicPlayer />
    </motion.div>
  );
};

export default ListenerDashboard;
