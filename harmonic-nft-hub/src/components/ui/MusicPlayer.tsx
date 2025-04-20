import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  currentTrack: {
    title: string;
    artist: string;
    audioUrl: string;
    imageUrl: string;
  } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onStop,
}) => {
  // Early return if no track is provided
  if (!currentTrack) return null;

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        startProgressUpdate();
      } else {
        audioRef.current.pause();
        stopProgressUpdate();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      stopProgressUpdate();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startProgressUpdate = () => {
    progressInterval.current = window.setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const stopProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleProgressChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="container mx-auto flex items-center gap-4">
        <audio
          ref={audioRef}
          src={currentTrack?.audioUrl}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={onStop}
        />

        <img
          src={currentTrack?.imageUrl || "/placeholder.svg"}
          alt={currentTrack?.title || "Now playing"}
          className="h-12 w-12 rounded-md object-cover"
        />

        <div className="flex-1">
          <p className="font-medium">
            {currentTrack?.title || "Unknown Track"}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentTrack?.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onPlayPause}>
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2 min-w-[400px]">
            <span className="text-sm tabular-nums">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={([value]) => handleProgressChange(value)}
              className="flex-1"
            />
            <span className="text-sm tabular-nums">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={([value]) => handleVolumeChange(value)}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
