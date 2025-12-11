import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, TrendingUp, Brain } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1705905119187-c6986d4d44db?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Serene mountain sunrise"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-8">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">AI-Powered Wellness Support</span>
            </div>

            <h1
              data-testid="hero-title"
              className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold text-foreground mb-6 tracking-tight"
            >
              Sync Your Emotions with
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Real-Time Wellness</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Track your emotional state, receive personalized AI guidance, and discover patterns in your mental
              wellness journey. Find calm, one check-in at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                data-testid="get-started-btn"
                onClick={() => navigate('/assessment')}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105"
              >
                Start Your Check-In
              </button>
              <button
                data-testid="view-history-btn"
                onClick={() => navigate('/history')}
                className="px-8 py-3 bg-white text-primary border border-primary/20 rounded-full font-medium hover:bg-primary/5 transition-all"
              >
                View My Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-fraunces font-semibold text-foreground mb-4">
              Your Personal Wellness Companion
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mood Sync combines mindful self-reflection with AI-powered guidance to support your emotional well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              data-testid="feature-mood-tracking"
              className="bg-white rounded-3xl p-8 shadow-soft border border-border hover:shadow-float transition-all duration-300 emotion-card"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-foreground mb-3">
                Mindful Mood Tracking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Log your emotions, energy, focus, and mental state through our gentle, guided assessment
              </p>
            </div>

            {/* Feature 2 */}
            <div
              data-testid="feature-ai-guidance"
              className="bg-white rounded-3xl p-8 shadow-soft border border-border hover:shadow-float transition-all duration-300 emotion-card"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-foreground mb-3">
                AI Wellness Guidance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive personalized coping strategies and actionable wellness tips tailored to your current state
              </p>
            </div>

            {/* Feature 3 */}
            <div
              data-testid="feature-analytics"
              className="bg-white rounded-3xl p-8 shadow-soft border border-border hover:shadow-float transition-all duration-300 emotion-card"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-foreground mb-3">
                Track Your Progress
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize patterns, identify triggers, and celebrate improvements in your emotional wellness journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 border border-primary/10">
            <h2 className="text-3xl md:text-4xl font-fraunces font-semibold text-foreground mb-4">
              Ready to begin your wellness journey?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Take the first step towards emotional awareness and well-being
            </p>
            <button
              data-testid="cta-check-in-btn"
              onClick={() => navigate('/assessment')}
              className="px-10 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 text-lg"
            >
              Start Your Check-In Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
