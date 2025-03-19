
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Music, Upload, Wallet, BarChart2, Users, Settings, Plus, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MusicCard from '@/components/ui/MusicCard';
import MusicPlayer from '@/components/ui/MusicPlayer';
import EarningsChart from '@/components/dashboard/EarningsChart';
import PlaysChart from '@/components/dashboard/PlaysChart';
import CollectorDistribution from '@/components/dashboard/CollectorDistribution';
import { NFT } from '@/types';
import { logout } from '@/features/auth/authSlice';

// Mock data for artist uploads
const artistUploads: NFT[] = [
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

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);
  const { address } = useSelector((state: any) => state.wallet);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [mintDialogOpen, setMintDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<NFT | null>(null);
  const [activeTab, setActiveTab] = useState('uploads');
  const [analyticsView, setAnalyticsView] = useState('earnings');

  useEffect(() => {
    // Redirect if not authenticated or not an artist
    if (!isAuthenticated || role !== 'artist') {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role !== 'artist') {
    return null;
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Track uploaded successfully');
    setUploadDialogOpen(false);
  };

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('NFT minted successfully');
    setMintDialogOpen(false);
  };

  const handleMintNFT = (track: NFT) => {
    setSelectedTrack(track);
    setMintDialogOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
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
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-medium text-white">Artist Dashboard</h2>
                <div className="text-gray-400 text-sm mt-1 break-all">
                  {address && address.substring(0, 6) + '...' + address.substring(address.length - 4)}
                </div>
              </div>

              <nav className="space-y-2 mb-8">
                <button 
                  onClick={() => setActiveTab('uploads')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'uploads' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <Music className="h-4 w-4 mr-3" />
                  My Uploads
                </button>
                <button 
                  onClick={() => setActiveTab('earnings')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'earnings' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <BarChart2 className="h-4 w-4 mr-3" />
                  Analytics
                </button>
                <button 
                  onClick={() => setActiveTab('fans')}
                  className={`flex w-full items-center py-2 px-3 ${activeTab === 'fans' ? 'bg-white/5 text-neon-green' : 'text-gray-300 hover:text-neon-green hover:bg-white/5'} rounded-md transition-colors`}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Fans
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
                className="w-full bg-neon-green hover:bg-neon-green/90 text-black mb-4"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Music
              </Button>

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
              <h1 className="heading-md text-white mb-2">Artist Dashboard</h1>
              <p className="text-gray-400">
                Manage your uploads, track earnings, and connect with fans.
              </p>
            </header>

            {activeTab === 'uploads' && (
              <>
                <section className="mb-10">
                  <div className="glass-card p-8">
                    <h3 className="text-lg font-medium text-white mb-6">Performance Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                        <p className="text-2xl font-bold text-white">1.45 ETH</p>
                        <p className="text-neon-green text-xs">+0.25 ETH this month</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Collectors</p>
                        <p className="text-2xl font-bold text-white">24</p>
                        <p className="text-neon-green text-xs">+3 this week</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Total Plays</p>
                        <p className="text-2xl font-bold text-white">1,243</p>
                        <p className="text-neon-green text-xs">+156 this week</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Tabs defaultValue="uploads" className="mb-10">
                  <TabsList className="bg-black/20 border border-white/10">
                    <TabsTrigger value="uploads" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      My Uploads
                    </TabsTrigger>
                    <TabsTrigger value="drafts" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      Drafts
                    </TabsTrigger>
                    <TabsTrigger value="minted" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                      Minted NFTs
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="uploads" className="mt-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-white">Your Tracks</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neon-green text-neon-green"
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Upload
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {artistUploads.map((track) => (
                        <div key={track.id} className="glass-card p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                              <img src={track.imageUrl} alt={track.title} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{track.title}</p>
                              <p className="text-gray-400 text-sm">Uploaded on Feb 28, 2023</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-neon-green text-neon-green"
                              onClick={() => handleMintNFT(track)}
                            >
                              Mint NFT
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="drafts" className="mt-6">
                    <div className="neo-blur p-10 text-center">
                      <h3 className="text-lg font-medium text-white mb-4">No Drafts Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Your unfinished uploads will appear here.
                      </p>
                      <Button
                        className="bg-neon-green hover:bg-neon-green/90 text-black"
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Music
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="minted" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {artistUploads.map((nft, index) => (
                        <MusicCard key={nft.id} nft={nft} index={index} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {activeTab === 'earnings' && (
              <section className="mb-10">
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-white">Earnings Analytics</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant={analyticsView === 'earnings' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setAnalyticsView('earnings')}
                        className={analyticsView === 'earnings' ? 'bg-neon-green text-black' : 'border-white/10 text-gray-300'}
                      >
                        Earnings
                      </Button>
                      <Button 
                        variant={analyticsView === 'plays' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setAnalyticsView('plays')}
                        className={analyticsView === 'plays' ? 'bg-neon-green text-black' : 'border-white/10 text-gray-300'}
                      >
                        Plays
                      </Button>
                      <Button 
                        variant={analyticsView === 'collectors' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setAnalyticsView('collectors')}
                        className={analyticsView === 'collectors' ? 'bg-neon-green text-black' : 'border-white/10 text-gray-300'}
                      >
                        Collectors
                      </Button>
                    </div>
                  </div>

                  {analyticsView === 'earnings' && <EarningsChart />}
                  {analyticsView === 'plays' && <PlaysChart />}
                  {analyticsView === 'collectors' && <CollectorDistribution />}
                 
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Top Earning Track</h4>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                          <img src={artistUploads[0].imageUrl} alt={artistUploads[0].title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{artistUploads[0].title}</p>
                          <p className="text-neon-green">0.85 ETH</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Most Active Collector</h4>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 mr-3 flex items-center justify-center">
                          <span className="text-white font-bold">JD</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">0x68...3e21</p>
                          <p className="text-gray-400 text-sm">Owns 15 shares</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'fans' && (
              <section className="mb-10">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-medium text-white mb-6">Collector Analytics</h2>
                  
                  <div className="space-y-6">
                    <div className="glass-card p-4">
                      <h3 className="text-md font-medium text-white mb-4">Top Collectors</h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 mr-3 flex items-center justify-center">
                                <span className="text-white font-bold">{String.fromCharCode(64 + i)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-white">0x{Math.random().toString(16).slice(2, 8)}...{Math.random().toString(16).slice(2, 6)}</p>
                                <p className="text-gray-400 text-sm">{15 - i * 3} shares owned</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-neon-green">{(0.45 - i * 0.15).toFixed(2)} ETH</p>
                              <p className="text-gray-400 text-xs">Total value</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Total Collectors</p>
                        <p className="text-2xl font-bold text-white">24</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Engagement Rate</p>
                        <p className="text-2xl font-bold text-white">76%</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Avg. Collection Size</p>
                        <p className="text-2xl font-bold text-white">2.3</p>
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
                      <h3 className="text-md font-medium text-white mb-4">Profile Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="artistName">Artist Name</Label>
                          <Input 
                            id="artistName" 
                            defaultValue="CyberWave" 
                            className="bg-black/20 border-white/10 mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="bio">Biography</Label>
                          <Textarea 
                            id="bio" 
                            defaultValue="Electronic music producer specializing in synthwave and cyberpunk-inspired sounds." 
                            className="bg-black/20 border-white/10 mt-1 h-20"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="socialLinks">Social Media</Label>
                          <Input 
                            id="socialLinks" 
                            placeholder="Twitter handle" 
                            className="bg-black/20 border-white/10 mt-1 mb-2"
                          />
                          <Input 
                            placeholder="Instagram handle" 
                            className="bg-black/20 border-white/10 mb-2"
                          />
                          <Input 
                            placeholder="SoundCloud link" 
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        
                        <Button className="bg-neon-green hover:bg-neon-green/90 text-black">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h3 className="text-md font-medium text-white mb-4">Royalty Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="defaultRoyalty">Default Royalty Percentage</Label>
                          <Input 
                            id="defaultRoyalty" 
                            type="number" 
                            defaultValue="10" 
                            min="0" 
                            max="50" 
                            className="bg-black/20 border-white/10 mt-1"
                          />
                          <p className="text-gray-400 text-xs mt-1">
                            This will be the default royalty percentage for newly minted NFTs.
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="payoutWallet">Payout Wallet Address</Label>
                          <Input 
                            id="payoutWallet" 
                            defaultValue={address} 
                            className="bg-black/20 border-white/10 mt-1"
                          />
                          <p className="text-gray-400 text-xs mt-1">
                            All royalties and earnings will be sent to this address.
                          </p>
                        </div>
                        
                        <Button className="bg-neon-green hover:bg-neon-green/90 text-black">
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-black border border-neon-green/30 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Upload New Track</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload your music file and cover art. You can mint it as an NFT later.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Track Title</Label>
                <Input
                  id="title"
                  placeholder="Enter track title"
                  className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your track..."
                  className="bg-black/20 border-white/10 focus-visible:ring-neon-green h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cover Art</Label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-neon-green/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400 text-sm">Drop your image here or click to browse</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Audio File</Label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-neon-green/50 transition-colors">
                  <Music className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400 text-sm">Drop your audio file here or click to browse</p>
                  <p className="text-gray-500 text-xs mt-1">Supports MP3, WAV, FLAC (max 50MB)</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setUploadDialogOpen(false)} className="border-gray-700 text-white">
                Cancel
              </Button>
              <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                Upload Track
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
        <DialogContent className="bg-black border border-neon-green/30 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Mint as NFT</DialogTitle>
            <DialogDescription className="text-gray-400">
              Convert your track into an NFT and set ownership parameters.
            </DialogDescription>
          </DialogHeader>

          {selectedTrack && (
            <form onSubmit={handleMintSubmit}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img src={selectedTrack.imageUrl} alt={selectedTrack.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedTrack.title}</h3>
                </div>
              </div>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Share (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.05"
                    className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalShares">Total Shares</Label>
                  <Input
                    id="totalShares"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="100"
                    className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artistShares">Artist Retained Shares</Label>
                  <Input
                    id="artistShares"
                    type="number"
                    min="0"
                    placeholder="20"
                    className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                    required
                  />
                  <p className="text-gray-500 text-xs">
                    These shares will be retained by you and not available for sale.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="royalty">Royalty Percentage</Label>
                  <Input
                    id="royalty"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="10"
                    className="bg-black/20 border-white/10 focus-visible:ring-neon-green"
                    required
                  />
                  <p className="text-gray-500 text-xs">
                    Percentage of secondary sales that will be paid to you as royalties.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setMintDialogOpen(false)} className="border-gray-700 text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                  Mint NFT
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

export default ArtistDashboard;
