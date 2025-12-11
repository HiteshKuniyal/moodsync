import React from 'react';
import { Heart, Activity, Smile, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Coaches = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 data-testid="coaches-title" className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Your Wellness Coaches
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Expert guidance connecting mental wellness with physical fitness and lifestyle balance
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Running Coach - Coach Hitesh */}
          <div
            data-testid="coach-hitesh-card"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-soft border border-border hover:shadow-float transition-all"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-playfair font-bold text-foreground mb-2">Coach Hitesh</h2>
                <p className="text-sm font-semibold text-secondary uppercase tracking-wide">Running & Mental Wellness Coach</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-foreground/90 leading-relaxed">
                Mental wellness and physical fitness are deeply interconnected. When you move your body, you're not just building strength – you're releasing endorphins, reducing stress hormones, and creating new neural pathways.
              </p>
              
              <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-secondary" />
                  The Mind-Body Connection
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Running releases endorphins, natural mood elevators that combat depression and anxiety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Regular exercise improves sleep quality, essential for emotional regulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Physical activity reduces cortisol (stress hormone) and increases serotonin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Achievable fitness goals build confidence and self-efficacy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Coach Hitesh's Approach
                </h3>
                <p className="text-sm text-foreground/80 mb-4">
                  Start where you are. Whether you're managing stress, anxiety, or low mood, movement is medicine. Begin with:
                </p>
                <div className="space-y-3">
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-1">10-Minute Morning Walk</p>
                    <p className="text-xs text-muted-foreground">Sunlight exposure + gentle movement = mood boost</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-1">20-Minute Jog (3x per week)</p>
                    <p className="text-xs text-muted-foreground">Builds endurance and mental resilience</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-1">Weekly Progress Check-in</p>
                    <p className="text-xs text-muted-foreground">Track both physical and emotional improvements</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://wa.me/919557219998?text=Hi%20Coach%20Hitesh!%20I'd%20like%20to%20schedule%20a%20session."
                target="_blank"
                rel="noopener noreferrer"
                data-testid="schedule-hitesh-btn"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/bearded_human123"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="message-hitesh-btn"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-secondary/30 text-secondary rounded-full hover:bg-secondary/5 transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Lifestyle Coach */}
          <div
            data-testid="lifestyle-coach-card"
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-soft border border-border hover:shadow-float transition-all"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Smile className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-playfair font-bold text-foreground mb-2">Lifestyle Coach</h2>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Holistic Wellness Guide</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-foreground/90 leading-relaxed">
                True wellness extends beyond mental health and fitness. Your daily habits, environment, relationships, and routines create the foundation for lasting emotional well-being.
              </p>

              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3">Pillars of Lifestyle Wellness</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Sleep Hygiene</p>
                      <p className="text-xs text-muted-foreground">7-9 hours, consistent schedule, dark room, no screens 1hr before bed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Nutrition for Mood</p>
                      <p className="text-xs text-muted-foreground">Omega-3s, whole grains, leafy greens, limit processed foods</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Social Connection</p>
                      <p className="text-xs text-muted-foreground">Regular meaningful interactions, community involvement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Purpose & Growth</p>
                      <p className="text-xs text-muted-foreground">Learning new skills, helping others, pursuing passions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">5</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Stress Management</p>
                      <p className="text-xs text-muted-foreground">Boundaries, time management, regular breaks, hobbies</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                <h3 className="font-semibold text-foreground mb-3">Weekly Lifestyle Assessment</h3>
                <p className="text-sm text-foreground/80 mb-3">Rate yourself (1-10) on each pillar this week:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sleep Quality</span>
                    <span className="font-semibold">___ / 10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nutrition</span>
                    <span className="font-semibold">___ / 10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Social Connection</span>
                    <span className="font-semibold">___ / 10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Purpose & Growth</span>
                    <span className="font-semibold">___ / 10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stress Management</span>
                    <span className="font-semibold">___ / 10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                data-testid="lifestyle-assessment-btn"
                onClick={() => navigate('/lifestyle-assessment')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Start Assessment</span>
              </button>
              <button
                data-testid="lifestyle-resources-btn"
                onClick={() => navigate('/resources')}
                className="px-6 py-3 bg-white border border-primary/30 text-primary rounded-full hover:bg-primary/5 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-10 text-center border border-primary/20">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
            Ready to Transform Your Wellness?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Combine mental health tracking, physical fitness, and lifestyle optimization for comprehensive wellness
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/exercises')}
              className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
            >
              Explore Exercises
            </button>
            <button
              onClick={() => navigate('/resources')}
              className="px-8 py-3 bg-white border border-primary/30 text-primary rounded-full hover:bg-primary/5 transition-all"
            >
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coaches;
