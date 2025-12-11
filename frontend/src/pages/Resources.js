import React, { useState } from 'react';
import { Podcast, Video, Brain, ExternalLink, BookOpen } from 'lucide-react';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('podcasts');

  const podcasts = [
    {
      title: 'The Mindful Kind',
      host: 'Rachael Kable',
      description: 'Simple, practical mindfulness tips for everyday life',
      link: 'https://www.rachaelkable.com/podcast',
      topics: ['Mindfulness', 'Stress Management', 'Daily Practice'],
    },
    {
      title: 'The Happiness Lab',
      host: 'Dr. Laurie Santos',
      description: 'Science-backed strategies to increase happiness and well-being',
      link: 'https://www.pushkin.fm/podcasts/the-happiness-lab-with-dr-laurie-santos',
      topics: ['Positive Psychology', 'Well-being', 'Research'],
    },
    {
      title: 'On Being',
      host: 'Krista Tippett',
      description: 'Conversations about meaning, resilience, and the human spirit',
      link: 'https://onbeing.org/series/podcast/',
      topics: ['Philosophy', 'Spirituality', 'Resilience'],
    },
    {
      title: 'Unlocking Us',
      host: 'Brené Brown',
      description: 'Vulnerability, courage, and authentic connection',
      link: 'https://brenebrown.com/podcast-show/unlocking-us/',
      topics: ['Vulnerability', 'Courage', 'Connection'],
    },
    {
      title: 'Feel Better, Live More',
      host: 'Dr. Rangan Chatterjee',
      description: 'Health, happiness, and living your best life',
      link: 'https://drchatterjee.com/podcast/',
      topics: ['Health', 'Lifestyle', 'Prevention'],
    },
  ];

  const videos = [
    {
      title: 'The Power of Vulnerability',
      creator: 'Brené Brown',
      platform: 'TED',
      description: 'Embracing vulnerability as the birthplace of courage and connection',
      link: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
      duration: '20 min',
    },
    {
      title: 'All it takes is 10 mindful minutes',
      creator: 'Andy Puddicombe',
      platform: 'TED',
      description: 'Introduction to mindfulness and meditation practice',
      link: 'https://www.ted.com/talks/andy_puddicombe_all_it_takes_is_10_mindful_minutes',
      duration: '9 min',
    },
    {
      title: 'How to make stress your friend',
      creator: 'Kelly McGonigal',
      platform: 'TED',
      description: 'Changing your relationship with stress',
      link: 'https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend',
      duration: '14 min',
    },
    {
      title: 'The happy secret to better work',
      creator: 'Shawn Achor',
      platform: 'TED',
      description: 'Why happiness leads to success, not the other way around',
      link: 'https://www.ted.com/talks/shawn_achor_the_happy_secret_to_better_work',
      duration: '12 min',
    },
    {
      title: 'The skill of self confidence',
      creator: 'Dr. Ivan Joseph',
      platform: 'TEDx',
      description: 'Building unshakable self-confidence through practice',
      link: 'https://www.youtube.com/watch?v=w-HYZv6HzAs',
      duration: '13 min',
    },
  ];

  const cognitiveReframingExercises = [
    {
      title: 'Challenge Catastrophic Thinking',
      description: 'Transform worst-case scenarios into realistic perspectives',
      steps: [
        'Identify the catastrophic thought (e.g., "This presentation will be a disaster")',
        'Ask: What is the worst that could realistically happen?',
        'Ask: What is the best that could happen?',
        'Ask: What is most likely to happen?',
        'Reframe: "I\'m prepared, and even if I make mistakes, I\'ll learn from them"',
      ],
      example: 'Instead of "I\'ll fail and lose everything" → "This is challenging, but I have skills and support"',
    },
    {
      title: 'Evidence-Based Thinking',
      description: 'Test your negative thoughts against reality',
      steps: [
        'Write down the negative thought',
        'List evidence FOR this thought',
        'List evidence AGAINST this thought',
        'Consider alternative explanations',
        'Create a balanced thought based on all evidence',
      ],
      example: 'Thought: "Nobody likes me" → Evidence shows: 3 friends checked on me this week, colleague invited me to lunch',
    },
    {
      title: 'Decatastrophizing',
      description: 'Reduce the perceived severity of feared outcomes',
      steps: [
        'Rate how bad the situation seems (0-100)',
        'If it happened, how would you cope?',
        'What resources/support do you have?',
        'How likely is this to happen? (0-100%)',
        'Re-rate the severity after reflection',
      ],
      example: 'Making a mistake at work feels like 90/100 → After reflection: 40/100 and very manageable',
    },
    {
      title: 'Positive Reframing',
      description: 'Find growth opportunities in difficult situations',
      steps: [
        'Describe the difficult situation objectively',
        'What can I learn from this?',
        'What strengths am I developing?',
        'How might this benefit me in the future?',
        'What would I tell a friend in this situation?',
      ],
      example: 'Job rejection → Opportunity to find better fit, practice resilience, refine my approach',
    },
    {
      title: 'Label the Thinking Error',
      description: 'Identify and correct common cognitive distortions',
      distortions: [
        'All-or-Nothing: Seeing things in black and white',
        'Overgeneralization: One event means everything is terrible',
        'Mental Filter: Focusing only on negatives',
        'Mind Reading: Assuming you know what others think',
        'Fortune Telling: Predicting negative outcomes',
        'Personalization: Blaming yourself for things outside your control',
      ],
      example: 'Notice: "I made one mistake = I\'m a complete failure" is All-or-Nothing thinking',
    },
  ];

  const learningResources = [
    {
      title: 'Cognitive Behavioral Therapy (CBT) Basics',
      description: 'Free online course introducing CBT principles',
      link: 'https://www.getselfhelp.co.uk/freedownloads2.htm',
      type: 'Course',
    },
    {
      title: 'MindShift CBT App',
      description: 'Evidence-based app for anxiety relief using CBT',
      link: 'https://www.anxietycanada.com/resources/mindshift-cbt/',
      type: 'App',
    },
    {
      title: 'Thought Record Worksheet',
      description: 'Printable worksheets for challenging negative thoughts',
      link: 'https://www.getselfhelp.co.uk/docs/ThoughtRecordSheet7.pdf',
      type: 'Worksheet',
    },
    {
      title: 'Feeling Good by David Burns',
      description: 'Classic book on cognitive therapy techniques',
      link: 'https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336',
      type: 'Book',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 data-testid="resources-title" className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Wellness Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Curated podcasts, videos, and cognitive reframing exercises for your mental wellness journey
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[
            { id: 'podcasts', label: 'Podcasts', icon: Podcast },
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'reframing', label: 'Cognitive Reframing', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-testid={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Podcasts Tab */}
          {activeTab === 'podcasts' && (
            <div data-testid="podcasts-section" className="space-y-4">
              {podcasts.map((podcast, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border hover:shadow-float transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Podcast className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-playfair font-bold text-foreground">{podcast.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {podcast.host}</p>
                      <p className="text-foreground/80 mb-3">{podcast.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {podcast.topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={podcast.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`podcast-link-${idx}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg flex-shrink-0"
                    >
                      <span className="text-sm font-semibold">Listen</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div data-testid="videos-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border hover:shadow-float transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="w-6 h-6 text-secondary" />
                    <span className="px-2 py-1 rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-foreground mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {video.creator} • {video.platform}
                  </p>
                  <p className="text-foreground/80 mb-4">{video.description}</p>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`video-link-${idx}`}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all shadow-lg"
                  >
                    <span className="text-sm font-semibold">Watch</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Cognitive Reframing Tab */}
          {activeTab === 'reframing' && (
            <div data-testid="reframing-section" className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-2xl font-playfair font-bold text-foreground mb-3">What is Cognitive Reframing?</h3>
                <p className="text-foreground/80 mb-4">
                  Cognitive reframing is a powerful psychological technique that helps you identify and challenge negative or unhelpful thoughts, replacing them with more balanced and realistic perspectives. It's a core component of Cognitive Behavioral Therapy (CBT).
                </p>
                <p className="text-foreground/80">
                  By changing how you think about situations, you change how you feel and act. These exercises help you develop healthier thinking patterns.
                </p>
              </div>

              {cognitiveReframingExercises.map((exercise, idx) => (
                <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    <Brain className="w-8 h-8 text-accent flex-shrink-0" />
                    <div>
                      <h3 className="text-2xl font-playfair font-bold text-foreground mb-2">{exercise.title}</h3>
                      <p className="text-foreground/80">{exercise.description}</p>
                    </div>
                  </div>

                  {exercise.steps && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-3">Steps:</h4>
                      <ol className="space-y-2">
                        {exercise.steps.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent">
                              {i + 1}
                            </span>
                            <span className="text-foreground/80">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {exercise.distortions && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-3">Common Thinking Errors:</h4>
                      <ul className="space-y-2">
                        {exercise.distortions.map((distortion, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-accent mt-1">•</span>
                            <span className="text-sm text-foreground/80">{distortion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                    <p className="text-sm font-semibold text-accent mb-1">Example:</p>
                    <p className="text-sm text-foreground/80">{exercise.example}</p>
                  </div>
                </div>
              ))}

              {/* Learning Resources */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-playfair font-bold text-foreground">Additional Learning Resources</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningResources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`learning-resource-${idx}`}
                      className="p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="inline-block px-2 py-1 rounded-full bg-primary/20 text-xs font-semibold text-primary mb-2">
                            {resource.type}
                          </span>
                          <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
