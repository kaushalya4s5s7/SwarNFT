
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { playTrack, pauseTrack, resumeTrack } from '@/features/music/musicSlice';

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const { currentlyPlaying, isPlaying, queue } = useSelector((state: any) => state.music);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        startProgressTimer();
      } else {
        audioRef.current.pause();
        stopProgressTimer();
      }
    }
  }, [isPlaying, currentlyPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const startProgressTimer = () => {
    stopProgressTimer();
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pauseTrack());
    } else {
      dispatch(resumeTrack());
    }
  };

  const handleSkipNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      dispatch(playTrack(nextTrack));
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentlyPlaying) {
    return null;
  }

  return (
    <AnimatePresence>
      {currentlyPlaying && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 z-50"
        >
          <audio
            ref={audioRef}
            src={currentlyPlaying.audioUrl}
            onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
            onEnded={handleSkipNext}
            hidden
          />
          
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3 flex items-center space-x-3">
              <div className="h-12 w-12 relative overflow-hidden rounded-md">
                <img 
                  src={currentlyPlaying.imageUrl} 
                  alt={currentlyPlaying.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="truncate">
                <p className="font-medium text-white truncate">{currentlyPlaying.title}</p>
                <p className="text-xs text-gray-400">{currentlyPlaying.artist}</p>
              </div>
            </div>
            
            <div className="col-span-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-2">
                  <button
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    )}
                  </button>
                  <button
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    onClick={handleSkipNext}
                    disabled={queue.length === 0}
                  >
                    <SkipForward className={`h-4 w-4 ${queue.length === 0 ? 'text-gray-600' : 'text-white'}`} />
                  </button>
                </div>
                
                <div className="w-full flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-10 text-right">{formatTime(progress)}</span>
                  <Slider
                    value={[progress]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleProgressChange}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            <div className="col-span-3 flex items-center justify-end space-x-2">
              <button
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </button>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;
