import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, User } from 'lucide-react';

const Layout = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true); // On by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const audioRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('moodSyncUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto-play peaceful music on first interaction
  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => console.log('Auto-play prevented:', e));
        document.removeEventListener('click', handleFirstClick);
      }
    };

    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [isPlaying]);

  // Create peaceful ambient music with Web Audio API
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    let oscillators = [];
    let gainNodes = [];

    const playPeacefulMusic = () => {
      if (oscillators.length > 0) return;

      // Peaceful frequencies creating a calm soundscape
      const peacefulFreqs = [
        { freq: 174, gain: 0.08, delay: 0 },      // Pain relief frequency
        { freq: 285, gain: 0.06, delay: 0.5 },    // Healing frequency
        { freq: 396, gain: 0.05, delay: 1 },      // Liberating guilt/fear
        { freq: 528, gain: 0.07, delay: 1.5 },    // DNA repair/love frequency
        { freq: 639, gain: 0.04, delay: 2 },      // Relationships
        { freq: 741, gain: 0.03, delay: 2.5 },    // Awakening intuition
      ];

      peacefulFreqs.forEach((note) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime + note.delay);
        gain.gain.linearRampToValueAtTime(note.gain * volume, audioContext.currentTime + note.delay + 6);

        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(audioContext.currentTime + note.delay);
        
        oscillators.push(osc);
        gainNodes.push(gain);
      });
    };

    const stopMusic = () => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      oscillators = [];
      gainNodes = [];
    };

    if (isPlaying) {
      playPeacefulMusic();
    } else {
      stopMusic();
    }

    return () => stopMusic();
  }, [isPlaying, volume]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-4 group">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-white text-lg md:text-2xl font-playfair font-bold">M</span>
            </div>
            <div>
              <span className="text-xl md:text-3xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">Mood Sync</span>
              <p className="text-xs text-muted-foreground -mt-1 hidden md:block">Syncing Emotions with Wellness</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/assessment" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/assessment' ? 'text-primary' : 'text-muted-foreground'}`}>Check In</Link>
            <Link to="/coaches" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/coaches' ? 'text-primary' : 'text-muted-foreground'}`}>Coaches</Link>
            <Link to="/wellness-activities" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/wellness-activities' ? 'text-primary' : 'text-muted-foreground'}`}>Activities</Link>
            <Link to="/gratitude" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/gratitude' ? 'text-primary' : 'text-muted-foreground'}`}>Gratitude</Link>
            <Link to="/resources" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/resources' ? 'text-primary' : 'text-muted-foreground'}`}>Resources</Link>
            <Link to="/history" className={`text-sm font-semibold hover:text-primary transition-colors ${location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'}`}>Journey</Link>
          </div>

          {/* Right side - Sound + User + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Sound Icon */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-white hover:bg-primary/10 border border-primary/20 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
              title={isPlaying ? 'Mute OM' : 'Play OM'}
              data-testid="sound-toggle"
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* User Icon / Login */}
            {user ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{user.name || user.phone}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
                    <button
                      onClick={() => {
                        localStorage.removeItem('moodSyncUser');
                        window.location.reload();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-xs font-semibold text-primary hover:underline">Login</Link>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center hover:bg-muted/50 transition-all"
              data-testid="hamburger-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <Link to="/assessment" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">Check In</Link>
              <Link to="/coaches" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">Coaches</Link>
              <Link to="/wellness-activities" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">Wellness Activities</Link>
              <Link to="/gratitude" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">Gratitude Journal</Link>
              <Link to="/resources" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">Resources</Link>
              <Link to="/history" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-foreground hover:text-primary">My Journey</Link>
              <div className="pt-3 border-t border-border">
                {user ? (
                  <div className="flex items-center gap-2 py-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{user.name || user.phone}</span>
                  </div>
                ) : (
                  <Link to="/login" onClick={closeMobileMenu} className="block py-2 text-sm font-semibold text-primary">Login / Sign Up</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-24 pb-20">{children}</main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/70 border-t border-border py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            An initiative by <span className="font-semibold text-primary">Hitesh Kuniyal</span>
          </p>
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem('moodSyncUser');
                window.location.reload();
              }}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
