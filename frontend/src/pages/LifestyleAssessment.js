import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LifestyleAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState({
    sleep_quality: 5,
    nutrition: 5,
    social_connection: 5,
    purpose_growth: 5,
    stress_management: 5,
  });
  const [notes, setNotes] = useState('');

  const pillars = [
    {
      key: 'sleep_quality',
      label: 'Sleep Quality',
      description: '7-9 hours, consistent schedule, quality rest',
      color: 'from-blue-500 to-blue-400',
    },
    {
      key: 'nutrition',
      label: 'Nutrition',
      description: 'Balanced diet, hydration, mindful eating',
      color: 'from-green-500 to-green-400',
    },
    {
      key: 'social_connection',
      label: 'Social Connection',
      description: 'Meaningful relationships, community involvement',
      color: 'from-purple-500 to-purple-400',
    },
    {
      key: 'purpose_growth',
      label: 'Purpose & Growth',
      description: 'Learning, goals, personal development',
      color: 'from-orange-500 to-orange-400',
    },
    {
      key: 'stress_management',
      label: 'Stress Management',
      description: 'Boundaries, relaxation, coping strategies',
      color: 'from-red-500 to-red-400',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/lifestyle/assess`, {
        ...scores,
        notes,
        date: new Date().toISOString(),
      });

      setSubmitted(true);
      toast.success('Lifestyle assessment saved successfully!');
      
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = () => {
    const values = Object.values(scores);
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    if (score >= 3) return 'Needs Improvement';
    return 'Poor';
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-96px)] py-12 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
            Assessment Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your weekly lifestyle assessment has been saved. Keep tracking your progress!
          </p>
          <div className="text-6xl font-playfair font-bold text-primary mb-2">
            {calculateAverage()}/10
          </div>
          <p className="text-sm text-muted-foreground">Overall Wellness Score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/coaches')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Coaches</span>
          </button>
          <h1 data-testid="lifestyle-assessment-title" className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-3">
            Weekly Lifestyle Assessment
          </h1>
          <p className="text-muted-foreground">
            Rate yourself (1-10) on each wellness pillar this week. Be honest – this helps track your progress.
          </p>
        </div>

        {/* Assessment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Score Display */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Overall Score</p>
            <div className={`text-6xl font-playfair font-bold ${getScoreColor(parseFloat(calculateAverage()))} mb-2`}>
              {calculateAverage()}/10
            </div>
            <p className="text-sm text-muted-foreground">
              {parseFloat(calculateAverage()) >= 8
                ? 'Excellent wellness! Keep it up!'
                : parseFloat(calculateAverage()) >= 6
                ? 'Good progress, room to improve'
                : parseFloat(calculateAverage()) >= 4
                ? 'Focus on key areas for improvement'
                : 'Let\'s work on building better habits'}
            </p>
          </div>

          {/* Pillar Ratings */}
          <div className="space-y-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.key}
                data-testid={`pillar-${pillar.key}`}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{pillar.label}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-4xl font-playfair font-bold ${getScoreColor(scores[pillar.key])}`}>
                      {scores[pillar.key]}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 10</div>
                    <div className={`text-xs font-semibold mt-1 ${getScoreColor(scores[pillar.key])}`}>
                      {getScoreLabel(scores[pillar.key])}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores[pillar.key]}
                    onChange={(e) => setScores({ ...scores, [pillar.key]: parseInt(e.target.value) })}
                    data-testid={`slider-${pillar.key}`}
                    className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 - Poor</span>
                    <span>5 - Moderate</span>
                    <span>10 - Excellent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Notes */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-3">Additional Notes (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Any insights, challenges, or wins from this week? What do you want to focus on?
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="notes-textarea"
              placeholder="This week I noticed..."
              rows={4}
              className="w-full p-4 rounded-xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/coaches')}
              className="px-8 py-3 bg-white border border-border text-foreground rounded-full hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="submit-assessment-btn"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Assessment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LifestyleAssessment;
