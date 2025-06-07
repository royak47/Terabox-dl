import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleInteraction = () => {
    setShowControls(true);
  };

  return (
    <div
      className="relative w-full aspect-video bg-black overflow-hidden"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        muted={muted}
        playsInline
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {showControls && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={togglePlay}
            className="p-3 bg-white/80 dark:bg-black/70 rounded-full mx-2"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black dark:text-white" />
            ) : (
              <Play className="w-6 h-6 text-black dark:text-white" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-3 bg-white/80 dark:bg-black/70 rounded-full mx-2 absolute bottom-4 right-4"
          >
            {muted ? (
              <VolumeX className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-black dark:text-white" />
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}
