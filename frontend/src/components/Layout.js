import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Pause, Volume2 } from 'lucide-react';

const Layout = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);
  const location = useLocation();

  // Create a simple zen tone using Web Audio API
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    let oscillator = null;
    let gainNode = null;

    const playZenTone = () => {
      if (oscillator) return;

      // Create oscillator for ambient tone
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(174.61, audioContext.currentTime); // F note (calming frequency)
      gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime); // Very subtle

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
    };

    const stopZenTone = () => {
      if (oscillator) {
        oscillator.stop();
        oscillator = null;
        gainNode = null;
      }
    };

    if (isPlaying) {
      playZenTone();
    } else {
      stopZenTone();
    }

    return () => stopZenTone();
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-fraunces font-semibold">M</span>
            </div>
            <span className="text-xl font-fraunces font-semibold text-primary tracking-tight">Mood Sync</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/assessment"
              data-testid="nav-assessment-link"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/assessment' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Check In
            </Link>
            <Link
              to="/history"
              data-testid="nav-history-link"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              My Journey
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Music Player */}
      <div
        data-testid="music-player"
        className={`fixed bottom-8 right-8 z-50 bg-white/80 backdrop-blur-md border border-white/50 rounded-full p-2 pr-6 shadow-float flex items-center gap-4 ${
          isPlaying ? 'playing' : ''
        }`}
      >
        <button
          data-testid="music-player-toggle"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" data-testid="pause-icon" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" data-testid="play-icon" />
          )}
        </button>

        <div className="flex items-center gap-3 min-w-[120px]">
          <Volume2 className="w-4 h-4 text-primary" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            data-testid="volume-slider"
            className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
          />
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          {isPlaying ? 'Zen Mode' : 'Paused'}
        </span>
      </div>
    </div>
  );
};

export default Layout;
