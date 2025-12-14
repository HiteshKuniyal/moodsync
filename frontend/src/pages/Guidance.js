import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

const Guidance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('moodSyncUser') || 'null');
  const [moodEntry, setMoodEntry] = useState(null);

  useEffect(() => {
    if (location.state?.moodEntry) {
      setMoodEntry(location.state.moodEntry);
    } else {
      // If no mood entry, redirect to assessment
      navigate('/assessment');
    }
  }, [location, navigate]);

  if (!moodEntry) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(moodEntry.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Personalized Guidance</span>
          </div>

          <h1
            data-testid="guidance-title"
            className="text-4xl md:text-5xl font-fraunces font-semibold text-foreground mb-4"
          >
            Your Wellness Guide
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>

        {/* Mood Summary Card */}
        <div
          data-testid="mood-summary-card"
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 mb-8 border border-primary/10"
        >
          <h2 className="text-xl font-fraunces font-semibold text-foreground mb-4">Your Emotional State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-fraunces font-bold text-primary mb-1">
                {moodEntry.emotion}
              </div>
              <div className="text-xs text-muted-foreground">Emotion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-fraunces font-bold text-primary mb-1">
                {moodEntry.emotion_level}/10
              </div>
              <div className="text-xs text-muted-foreground">Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-fraunces font-bold text-secondary mb-1">
                {moodEntry.energy_level}/10
              </div>
              <div className="text-xs text-muted-foreground">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-fraunces font-bold text-accent mb-1">
                {moodEntry.focus_level}/10
              </div>
              <div className="text-xs text-muted-foreground">Focus</div>
            </div>
          </div>
        </div>

        {/* AI Guidance Letter - Solid background for better readability on iOS */}
        <div
          data-testid="ai-guidance-content"
          className="bg-white rounded-3xl p-10 md:p-12 shadow-soft border border-border mb-8"
        >
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground/90 leading-relaxed whitespace-pre-line font-manrope">
              {moodEntry.ai_guidance.split(/(breathing|breathe|breath)/gi).map((part, index) => {
                if (part.toLowerCase().match(/breath/)) {
                  return (
                    <a
                      key={index}
                      href="/wellness-activities#breathing"
                      className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                    >
                      {part}
                    </a>
                  );
                }
                return part;
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground italic">With care and support,</p>
              <p className="text-base font-fraunces font-semibold text-primary mt-1">Your Mood Sync Companion</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            data-testid="view-history-btn"
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <span>View My Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            data-testid="new-check-in-btn"
            onClick={() => navigate('/assessment')}
            className="px-8 py-3 bg-white text-primary border border-primary/20 rounded-full hover:bg-primary/5 transition-all"
          >
            New Check-In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guidance;
