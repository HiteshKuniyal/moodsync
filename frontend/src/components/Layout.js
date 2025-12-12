import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

const Layout = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);
  const location = useLocation();

  // Create OM chant with deep meditative resonance
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    let oscillators = [];
    let gainNodes = [];
    let lfoOscillators = [];

    const playOM = () => {
      if (oscillators.length > 0) return;

      // OM fundamental frequency (136.1 Hz - Earth tone) with harmonics
      const omFrequencies = [
        { freq: 136.1, gain: 0.15 },   // Fundamental OM
        { freq: 272.2, gain: 0.08 },   // 2nd harmonic (octave)
        { freq: 408.3, gain: 0.04 },   // 3rd harmonic
        { freq: 204.15, gain: 0.06 }   // Sub harmonic for depth
      ];

      omFrequencies.forEach((note, index) => {
        // Main OM tone
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, audioContext.currentTime);
        
        // Add very subtle vibrato for natural resonance
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.3, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        
        // Very slow fade in for deep meditative quality
        gain.gain.linearRampToValueAtTime(note.gain * volume, audioContext.currentTime + 4);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        lfo.start();
        
        oscillators.push(osc);
        gainNodes.push(gain);
        lfoOscillators.push(lfo);
      });
    };

    const stopOM = () => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      lfoOscillators.forEach(lfo => {
        try {
          lfo.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillators = [];
      gainNodes = [];
      lfoOscillators = [];
    };

    if (isPlaying) {
      playOM();
    } else {
      stopOM();
    }

    return () => stopOM();
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/70 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-4 group">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-white text-lg md:text-2xl font-playfair font-bold">M</span>
            </div>
            <div>
              <span className="text-xl md:text-3xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">Mood Sync</span>
              <p className="text-xs text-muted-foreground -mt-1 hidden md:block">Syncing Emotions with Wellness</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-8">
            <Link
              to="/assessment"
              data-testid="nav-assessment-link"
              className={`text-xs md:text-sm font-semibold hover:text-primary transition-colors ${
                location.pathname === '/assessment' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Check In
            </Link>
            <Link
              to="/coaches"
              data-testid="nav-coaches-link"
              className={`text-xs md:text-sm font-semibold hover:text-primary transition-colors hidden sm:block ${
                location.pathname === '/coaches' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Coaches
            </Link>
            <Link
              to="/exercises"
              data-testid="nav-exercises-link"
              className={`text-xs md:text-sm font-semibold hover:text-primary transition-colors hidden md:block ${
                location.pathname === '/exercises' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Exercises
            </Link>
            <Link
              to="/resources"
              data-testid="nav-resources-link"
              className={`text-xs md:text-sm font-semibold hover:text-primary transition-colors hidden md:block ${
                location.pathname === '/resources' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/history"
              data-testid="nav-history-link"
              className={`text-xs md:text-sm font-semibold hover:text-primary transition-colors ${
                location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Journey
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-24 pb-20">{children}</main>

      {/* Footer with Sound and Developer Credit */}
      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/70 border-t border-border py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Developer Credit */}
          <div>
            <p className="text-xs text-muted-foreground">
              Developed by <span className="font-semibold text-primary">Hitesh Kuniyal</span>
            </p>
          </div>

          {/* Sound Icon - Mute/Unmute */}
          <button
            data-testid="music-player-toggle"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white hover:bg-primary/10 border border-primary/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title={isPlaying ? 'Mute OM Chant' : 'Play OM Chant'}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-primary" data-testid="volume-icon" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" data-testid="volume-x-icon" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
