import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import apiClient from '../utils/api';

const emotions = [
  { value: 'Sad', emoji: '😢', color: 'from-blue-100 to-blue-50' },
  { value: 'Anxious', emoji: '😰', color: 'from-yellow-100 to-yellow-50' },
  { value: 'Depressed', emoji: '😔', color: 'from-gray-100 to-gray-50' },
  { value: 'Angry', emoji: '😠', color: 'from-red-100 to-red-50' },
  { value: 'Overwhelmed', emoji: '😵', color: 'from-purple-100 to-purple-50' },
  { value: 'Tired', emoji: '😴', color: 'from-indigo-100 to-indigo-50' },
  { value: 'Stressed', emoji: '😫', color: 'from-orange-100 to-orange-50' },
];

const overthinkingOptions = [
  { value: 'No', label: 'Not at all' },
  { value: 'Slightly', label: 'A little' },
  { value: 'A lot', label: 'Quite a bit' },
  { value: 'Constantly', label: 'All the time' },
];

const MoodAssessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emotion: '',
    emotion_level: 5,
    energy_level: 5,
    focus_level: 5,
    overthinking: '',
    trigger: '',
    pattern: '',
    underlying_cause: '',
    additional_notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.emotion || !formData.overthinking) {
      toast.error('Please complete all required questions');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/mood/submit', formData);
      toast.success('Your mood entry has been recorded!');
      navigate('/guidance', { state: { moodEntry: response.data } });
    } catch (error) {
      console.error('Error submitting mood:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.emotion) {
      toast.error('Please select an emotion');
      return;
    }
    if (step === 5 && !formData.overthinking) {
      toast.error('Please select an option');
      return;
    }
    if (step < 9) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of 9
            </span>
            <span className="text-sm font-medium text-primary">{Math.round((step / 9) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-border">
          {/* Step 1: Emotion Selection */}
          {step === 1 && (
            <div className="space-y-8" data-testid="step-emotion">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  What is the dominant emotion you're feeling?
                </h2>
                <p className="text-muted-foreground">Select the emotion that best describes your current state</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.value}
                    data-testid={`emotion-${emotion.value.toLowerCase()}`}
                    onClick={() => setFormData({ ...formData, emotion: emotion.value })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${emotion.color} hover:shadow-md transition-all border-2 ${
                      formData.emotion === emotion.value
                        ? 'border-secondary shadow-lg scale-105'
                        : 'border-transparent hover:scale-102'
                    }`}
                  >
                    <span className="text-5xl mb-3">{emotion.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{emotion.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Emotion Level */}
          {step === 2 && (
            <div className="space-y-8" data-testid="step-emotion-level">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  How intense is this emotion?
                </h2>
                <p className="text-muted-foreground">Rate from 0 (minimal) to 10 (overwhelming)</p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-playfair font-bold text-primary mb-4">
                    {formData.emotion_level}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.emotion_level < 4
                      ? 'Mild'
                      : formData.emotion_level < 7
                      ? 'Moderate'
                      : 'Intense'}
                  </p>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.emotion_level}
                  onChange={(e) => setFormData({ ...formData, emotion_level: parseInt(e.target.value) })}
                  data-testid="emotion-level-slider"
                  className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 - Minimal</span>
                  <span>10 - Overwhelming</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Energy Level */}
          {step === 3 && (
            <div className="space-y-8" data-testid="step-energy-level">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  How energized do you feel?
                </h2>
                <p className="text-muted-foreground">Rate your current energy level</p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-playfair font-bold text-secondary mb-4">
                    {formData.energy_level}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.energy_level < 4 ? 'Exhausted' : formData.energy_level < 7 ? 'Moderate' : 'Energetic'}
                  </p>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.energy_level}
                  onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
                  data-testid="energy-level-slider"
                  className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 - Exhausted</span>
                  <span>10 - Highly Energetic</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Focus Level */}
          {step === 4 && (
            <div className="space-y-8" data-testid="step-focus-level">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  How focused do you feel?
                </h2>
                <p className="text-muted-foreground">Rate your ability to concentrate right now</p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-playfair font-bold text-accent mb-4">
                    {formData.focus_level}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.focus_level < 4
                      ? 'Distracted'
                      : formData.focus_level < 7
                      ? 'Moderate Focus'
                      : 'Highly Focused'}
                  </p>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.focus_level}
                  onChange={(e) => setFormData({ ...formData, focus_level: parseInt(e.target.value) })}
                  data-testid="focus-level-slider"
                  className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 - Very Distracted</span>
                  <span>10 - Highly Focused</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Overthinking */}
          {step === 5 && (
            <div className="space-y-8" data-testid="step-overthinking">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  Have you been overthinking?
                </h2>
                <p className="text-muted-foreground">How much are racing thoughts affecting you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overthinkingOptions.map((option) => (
                  <button
                    key={option.value}
                    data-testid={`overthinking-${option.value.toLowerCase()}`}
                    onClick={() => setFormData({ ...formData, overthinking: option.value })}
                    className={`p-6 rounded-2xl text-left transition-all border-2 ${
                      formData.overthinking === option.value
                        ? 'border-secondary bg-secondary/10 shadow-lg scale-105'
                        : 'border-border bg-muted/30 hover:border-secondary/50 hover:scale-102'
                    }`}
                  >
                    <div className="text-lg font-semibold text-foreground mb-1">{option.value}</div>
                    <div className="text-sm text-muted-foreground">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Trigger Identification */}
          {step === 6 && (
            <div className="space-y-8" data-testid="step-trigger">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  What triggered this emotion?
                </h2>
                <p className="text-muted-foreground">Identify the specific event, thought, or situation that sparked this feeling</p>
              </div>

              <textarea
                value={formData.trigger}
                onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                data-testid="trigger-textarea"
                placeholder="For example: A conversation, work deadline, memory, physical sensation..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          )}

          {/* Step 7: Pattern Recognition */}
          {step === 7 && (
            <div className="space-y-8" data-testid="step-pattern">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  Do you notice any patterns?
                </h2>
                <p className="text-muted-foreground">Have you felt this way before? When does it typically happen?</p>
              </div>

              <textarea
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                data-testid="pattern-textarea"
                placeholder="For example: This happens every Monday, When I'm alone, After social events, During certain times of day..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          )}

          {/* Step 8: Underlying Cause */}
          {step === 8 && (
            <div className="space-y-8" data-testid="step-underlying-cause">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  What might be the deeper cause?
                </h2>
                <p className="text-muted-foreground">Beyond the immediate trigger, what underlying need, fear, or belief might be at play?</p>
              </div>

              <textarea
                value={formData.underlying_cause}
                onChange={(e) => setFormData({ ...formData, underlying_cause: e.target.value })}
                data-testid="underlying-cause-textarea"
                placeholder="For example: Fear of failure, need for approval, past trauma, unmet expectations, core belief about myself..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          )}

          {/* Step 9: Additional Notes */}
          {step === 9 && (
            <div className="space-y-8" data-testid="step-additional-notes">
              <div>
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3">
                  Anything else you'd like to share?
                </h2>
                <p className="text-muted-foreground">Optional - Add any additional context about how you're feeling</p>
              </div>

              <textarea
                value={formData.additional_notes}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                data-testid="additional-notes-textarea"
                placeholder="Express yourself freely..."
                rows={6}
                className="w-full p-4 rounded-2xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <button
              onClick={prevStep}
              disabled={step === 1}
              data-testid="prev-step-btn"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 9 ? (
              <button
                onClick={nextStep}
                data-testid="next-step-btn"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                data-testid="submit-assessment-btn"
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Get Your Guidance</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAssessment;
