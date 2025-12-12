import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const WellnessActivities = () => {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [selectedMeditationTimer, setSelectedMeditationTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMeditationRunning, setIsMeditationRunning] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const intervalRef = useRef(null);
  const meditationIntervalRef = useRef(null);

  const timerOptions = [
    { duration: 3, label: '3 Minutes', desc: 'Quick calm' },
    { duration: 5, label: '5 Minutes', desc: 'Deep reset' },
    { duration: 10, label: '10 Minutes', desc: 'Full practice' },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success('Great job! Exercise complete.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Breathing pattern animation
  useEffect(() => {
    if (isRunning) {
      const phaseInterval = setInterval(() => {
        setPhase((current) => {
          if (current === 'inhale') return 'hold';
          if (current === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000); // 4 seconds per phase

      return () => clearInterval(phaseInterval);
    }
  }, [isRunning]);

  // Meditation timer effect
  useEffect(() => {
    if (isMeditationRunning && meditationTimeLeft > 0) {
      meditationIntervalRef.current = setInterval(() => {
        setMeditationTimeLeft((prev) => {
          if (prev <= 1) {
            setIsMeditationRunning(false);
            toast.success('Meditation complete! Well done.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    }

    return () => {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    };
  }, [isMeditationRunning, meditationTimeLeft]);

  const startTimer = (minutes) => {
    setSelectedTimer(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setPhase('inhale');
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTimer ? selectedTimer * 60 : 0);
    setPhase('inhale');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 data-testid="wellness-activities-title" className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Wellness Activities
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Guided practices to calm your mind, relax your body, and restore balance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Breathing Exercises */}
          <div
            data-testid="breathing-exercises-card"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-playfair font-bold text-foreground">Breathing Exercises</h2>
                <p className="text-sm text-muted-foreground">Guided breathing with timer</p>
              </div>
            </div>

            {!selectedTimer ? (
              /* Timer Selection */
              <div className="space-y-4">
                <p className="text-foreground/80 mb-6">
                  Choose your session duration. Follow the guided breathing pattern: 4 seconds inhale, 4 seconds hold, 4 seconds exhale.
                </p>

                {timerOptions.map((option) => (
                  <button
                    key={option.duration}
                    data-testid={`breathing-timer-${option.duration}min`}
                    onClick={() => startTimer(option.duration)}
                    className="w-full p-6 rounded-2xl bg-primary/10 border-2 border-primary/20 hover:border-primary hover:bg-primary/20 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {option.label}
                        </div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Active Timer */
              <div className="space-y-6">
                {/* Breathing Circle Animation */}
                <div className="flex items-center justify-center py-8">
                  <div
                    className={`w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/40 flex items-center justify-center transition-all duration-4000 ${
                      phase === 'inhale'
                        ? 'scale-150'
                        : phase === 'hold'
                        ? 'scale-150'
                        : 'scale-100'
                    }`}
                    style={{ transitionDuration: '4000ms' }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-playfair font-bold text-primary capitalize mb-2">
                        {phase}
                      </div>
                      <div className="text-sm text-muted-foreground">Follow the rhythm</div>
                    </div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-center">
                  <div className="text-6xl font-playfair font-bold text-primary mb-2" data-testid="timer-display">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground">remaining</div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {isRunning ? (
                    <button
                      data-testid="pause-timer-btn"
                      onClick={pauseTimer}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Pause className="w-5 h-5" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      data-testid="resume-timer-btn"
                      onClick={resumeTimer}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Play className="w-5 h-5" />
                      <span>Resume</span>
                    </button>
                  )}
                  <button
                    data-testid="reset-timer-btn"
                    onClick={resetTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-full hover:bg-muted/50 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                  <button
                    data-testid="change-duration-btn"
                    onClick={() => {
                      setSelectedTimer(null);
                      setIsRunning(false);
                      setTimeLeft(0);
                    }}
                    className="px-6 py-3 text-muted-foreground hover:text-foreground transition-all"
                  >
                    Change Duration
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progressive Muscle Relaxation */}
          <div
            data-testid="muscle-relaxation-card"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-playfair font-bold text-foreground">Progressive Muscle Relaxation</h2>
                <p className="text-sm text-muted-foreground">15-minute guided session</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-foreground/80">
                Release physical tension through systematic muscle tensing and relaxing. This technique reduces stress, improves sleep, and calms anxiety.
              </p>

              <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                <h3 className="font-semibold text-foreground mb-4">Session Guide (15 minutes)</h3>
                <div className="space-y-3">
                  {[
                    { time: '0-2 min', step: 'Find comfortable position, close eyes, take 3 deep breaths' },
                    { time: '2-4 min', step: 'Hands & Arms: Clench fists tight (5s), release completely (10s)' },
                    { time: '4-6 min', step: 'Face: Scrunch facial muscles (5s), release (10s)' },
                    { time: '6-8 min', step: 'Neck & Shoulders: Raise shoulders to ears (5s), drop and release (10s)' },
                    { time: '8-10 min', step: 'Chest & Back: Arch back gently (5s), release (10s)' },
                    { time: '10-12 min', step: 'Stomach: Tighten abdominal muscles (5s), release (10s)' },
                    { time: '12-14 min', step: 'Legs & Feet: Point toes down (5s), flex up (5s), release (10s)' },
                    { time: '14-15 min', step: 'Full body scan: Notice relaxation, breathe slowly' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-20 flex-shrink-0">
                        <span className="text-xs font-semibold text-accent">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground/80">{item.step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20">
                <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Reduces physical symptoms of anxiety and stress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Improves sleep quality and reduces insomnia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Lowers blood pressure and heart rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✓</span>
                    <span>Increases body awareness and mindfulness</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://www.youtube.com/watch?v=ClqPtWzozXs"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="start-pmr-btn"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-full hover:bg-accent/90 transition-all shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Start Guided Session</span>
              </a>
            </div>
          </div>
        </div>

        {/* Meditation Timers */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-playfair font-bold text-foreground">Meditation Timers</h2>
              <p className="text-sm text-muted-foreground">Guided silent meditation sessions</p>
            </div>
          </div>

          <p className="text-foreground/80 mb-6">
            Choose your meditation duration. Sit comfortably, close your eyes, and focus on your breath.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[5, 10, 15].map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  setSelectedMeditationTimer(duration);
                  setMeditationTimeLeft(duration * 60);
                  setIsMeditationRunning(true);
                  toast.success(`Starting ${duration}-minute meditation`);
                }}
                className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition-all text-center group"
                data-testid={`meditation-timer-${duration}min`}
              >
                <div className="text-4xl font-playfair font-bold text-purple-600 mb-2">{duration}</div>
                <div className="text-sm text-muted-foreground">minutes</div>
              </button>
            ))}
          </div>

          {isMeditationRunning && (
            <div className="mt-6 p-6 rounded-2xl bg-purple-100 border border-purple-200">
              <div className="text-center mb-4">
                <div className="text-5xl font-playfair font-bold text-purple-600" data-testid="meditation-timer-display">
                  {Math.floor(meditationTimeLeft / 60)}:{(meditationTimeLeft % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Breathe deeply and stay present</p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsMeditationRunning(false)}
                  className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all"
                >
                  Pause
                </button>
                <button
                  onClick={() => {
                    setIsMeditationRunning(false);
                    setMeditationTimeLeft(0);
                    setSelectedMeditationTimer(null);
                  }}
                  className="px-6 py-2 bg-white border border-border rounded-full hover:bg-muted/50 transition-all"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
          <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Consistency Matters</p>
                <p className="text-sm text-muted-foreground">Practice daily, ideally same time each day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wind className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Quiet Environment</p>
                <p className="text-sm text-muted-foreground">Find a peaceful space without distractions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Be Patient</p>
                <p className="text-sm text-muted-foreground">Benefits accumulate with regular practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercises;
