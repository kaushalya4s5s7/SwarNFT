
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, PlusCircle } from 'lucide-react';
import { NFT } from '@/types';
import { playTrack, pauseTrack, resumeTrack, addToQueue } from '@/features/music/musicSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MusicCardProps {
  nft: NFT;
  index?: number;
}

const MusicCard = ({ nft, index = 0 }: MusicCardProps) => {
  const dispatch = useDispatch();
  const { currentlyPlaying, isPlaying } = useSelector((state: any) => state.music);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const isCurrentlyPlaying = currentlyPlaying?.id === nft.id;

  const handlePlay = () => {
    if (!isAuthenticated) {
      toast.error('Connect your wallet to play music');
      return;
    }

    if (isCurrentlyPlaying) {
      if (isPlaying) {
        dispatch(pauseTrack());
      } else {
        dispatch(resumeTrack());
      }
    } else {
      dispatch(playTrack(nft));
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Connect your wallet to add to queue');
      return;
    }
    dispatch(addToQueue(nft));
    toast.success(`${nft.title} added to queue`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card overflow-hidden group cursor-pointer"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={handlePlay}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={nft.imageUrl} 
          alt={nft.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="h-14 w-14 rounded-full bg-neon-green flex items-center justify-center shadow-lg shadow-neon-green/20"
          >
            {isCurrentlyPlaying && isPlaying ? (
              <Pause className="h-6 w-6 text-black" />
            ) : (
              <Play className="h-6 w-6 text-black ml-1" />
            )}
          </motion.div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-white truncate">{nft.title}</h3>
            <p className="text-gray-400 text-sm">{nft.artist}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-neon-green opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAddToQueue}
            aria-label="Add to queue"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs font-medium bg-white/10 text-white px-2 py-1 rounded-full">
            {nft.availableShares}/{nft.totalShares} shares
          </div>
          <div className="text-neon-green font-medium">{nft.price} ETH</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
