import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, Brain, Zap, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const History = () => {
  const navigate = useNavigate();
  const [moodHistory, setMoodHistory] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgEmotion: 0,
    avgEnergy: 0,
    avgFocus: 0,
    totalEntries: 0,
  });
  const [triggerInsights, setTriggerInsights] = useState({ common_triggers: [], total_entries: 0 });
  const [triggerHeatmap, setTriggerHeatmap] = useState({ heatmap_data: [] });

  useEffect(() => {
    fetchMoodData();
    fetchTriggerInsights();
    fetchTriggerHeatmap();
  }, []);

  const fetchTriggerInsights = async () => {
    try {
      const response = await axios.get(`${API}/mood/trigger-insights`);
      setTriggerInsights(response.data);
    } catch (error) {
      console.error('Error fetching trigger insights:', error);
    }
  };

  const fetchTriggerHeatmap = async () => {
    try {
      const response = await axios.get(`${API}/mood/trigger-heatmap`);
      setTriggerHeatmap(response.data);
    } catch (error) {
      console.error('Error fetching trigger heatmap:', error);
    }
  };

  const fetchMoodData = async () => {
    try {
      const [historyRes, trendsRes] = await Promise.all([
        axios.get(`${API}/mood/history?limit=10`),
        axios.get(`${API}/mood/trends?days=14`),
      ]);

      setMoodHistory(historyRes.data);
      setTrendData(trendsRes.data);

      // Calculate stats
      if (historyRes.data.length > 0) {
        const avgEmotion =
          historyRes.data.reduce((sum, entry) => sum + entry.emotion_level, 0) / historyRes.data.length;
        const avgEnergy =
          historyRes.data.reduce((sum, entry) => sum + entry.energy_level, 0) / historyRes.data.length;
        const avgFocus =
          historyRes.data.reduce((sum, entry) => sum + entry.focus_level, 0) / historyRes.data.length;

        setStats({
          avgEmotion: avgEmotion.toFixed(1),
          avgEnergy: avgEnergy.toFixed(1),
          avgFocus: avgFocus.toFixed(1),
          totalEntries: historyRes.data.length,
        });
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
      toast.error('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1
              data-testid="history-title"
              className="text-4xl md:text-5xl font-fraunces font-semibold text-foreground mb-2"
            >
              My Wellness Journey
            </h1>
            <p className="text-muted-foreground">Track your emotional patterns and celebrate your progress</p>
          </div>
          <button
            data-testid="new-check-in-btn"
            onClick={() => navigate('/assessment')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Check-In</span>
          </button>
        </div>

        {moodHistory.length === 0 ? (
          /* Empty State */
          <div data-testid="empty-state" className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-fraunces font-semibold text-foreground mb-3">Start Your Wellness Journey</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't recorded any mood entries yet. Begin tracking your emotions to unlock insights and personalized
              guidance.
            </p>
            <button
              data-testid="start-first-check-in-btn"
              onClick={() => navigate('/assessment')}
              className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Start Your First Check-In
            </button>
          </div>
        ) : (
          <>
            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
              {/* Average Stats Cards */}
              <div
                data-testid="stat-avg-emotion"
                className="md:col-span-3 bg-white rounded-3xl p-6 shadow-soft border border-border hover:shadow-float transition-all emotion-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Emotion</span>
                </div>
                <div className="text-3xl font-fraunces font-bold text-primary">{stats.avgEmotion}/10</div>
              </div>

              <div
                data-testid="stat-avg-energy"
                className="md:col-span-3 bg-white rounded-3xl p-6 shadow-soft border border-border hover:shadow-float transition-all emotion-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Energy</span>
                </div>
                <div className="text-3xl font-fraunces font-bold text-secondary">{stats.avgEnergy}/10</div>
              </div>

              <div
                data-testid="stat-avg-focus"
                className="md:col-span-3 bg-white rounded-3xl p-6 shadow-soft border border-border hover:shadow-float transition-all emotion-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Focus</span>
                </div>
                <div className="text-3xl font-fraunces font-bold text-accent">{stats.avgFocus}/10</div>
              </div>

              <div
                data-testid="stat-total-entries"
                className="md:col-span-3 bg-white rounded-3xl p-6 shadow-soft border border-border hover:shadow-float transition-all emotion-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total Entries</span>
                </div>
                <div className="text-3xl font-fraunces font-bold text-primary">{stats.totalEntries}</div>
              </div>
            </div>

            {/* Trends Chart */}
            <div
              data-testid="trends-chart"
              className="bg-white rounded-3xl p-8 shadow-soft border border-border mb-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-fraunces font-semibold text-foreground">Mood Trends</h2>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(60, 5%, 85%)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(60, 5%, 40%)"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis stroke="hsl(60, 5%, 40%)" tick={{ fontSize: 12 }} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(60, 5%, 85%)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emotion_level"
                    stroke="hsl(105, 23%, 33%)"
                    strokeWidth={3}
                    name="Emotion"
                    dot={{ fill: 'hsl(105, 23%, 33%)', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy_level"
                    stroke="hsl(30, 54%, 64%)"
                    strokeWidth={3}
                    name="Energy"
                    dot={{ fill: 'hsl(30, 54%, 64%)', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="focus_level"
                    stroke="hsl(13, 69%, 63%)"
                    strokeWidth={3}
                    name="Focus"
                    dot={{ fill: 'hsl(13, 69%, 63%)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Trigger Insights */}
            {triggerInsights.common_triggers.length > 0 && (
              <div data-testid="trigger-insights" className="bg-white rounded-3xl p-8 shadow-soft border border-border mb-8">
                <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">Common Trigger Insights</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Based on {triggerInsights.total_entries} mood entries with identified triggers
                </p>
                
                <div className="space-y-4">
                  {triggerInsights.common_triggers.slice(0, 5).map((trigger, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground capitalize">{trigger.trigger}</span>
                        <span className="text-sm font-medium text-primary">{trigger.count} times</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(trigger.emotions).map(([emotion, count]) => (
                          <span key={emotion} className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {emotion} ({count})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trigger Heatmap */}
            {triggerHeatmap.heatmap_data.length > 0 && (
              <div data-testid="trigger-heatmap" className="bg-white rounded-3xl p-8 shadow-soft border border-border mb-8">
                <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">Trigger Intensity Heatmap</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Visual representation of trigger intensity over time
                </p>
                
                <div className="grid grid-cols-7 gap-2">
                  {triggerHeatmap.heatmap_data.slice(0, 49).map((data, index) => {
                    const intensityColor = data.intensity >= 8 ? 'bg-red-500' : 
                                          data.intensity >= 6 ? 'bg-orange-400' :
                                          data.intensity >= 4 ? 'bg-yellow-400' : 'bg-green-400';
                    return (
                      <div
                        key={index}
                        className={`h-16 rounded-lg ${intensityColor} flex items-center justify-center text-xs text-white font-medium p-2 text-center hover:scale-105 transition-transform cursor-pointer`}
                        title={`${data.date}: ${data.trigger} - ${data.emotion} (${data.intensity}/10)`}
                      >
                        {data.intensity}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-4 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-400"></div>
                    <span>Low (1-3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-400"></div>
                    <span>Medium (4-5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-400"></div>
                    <span>High (6-7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span>Very High (8-10)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Entries */}
            <div data-testid="recent-entries" className="bg-white rounded-3xl p-8 shadow-soft border border-border">
              <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">Recent Check-Ins</h2>

              <div className="space-y-4">
                {moodHistory.map((entry) => {
                  const entryDate = new Date(entry.timestamp);
                  return (
                    <div
                      key={entry.id}
                      data-testid={`mood-entry-${entry.id}`}
                      className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {entry.emotion === 'Sad'
                                ? '😢'
                                : entry.emotion === 'Anxious'
                                ? '😰'
                                : entry.emotion === 'Depressed'
                                ? '😔'
                                : entry.emotion === 'Angry'
                                ? '😠'
                                : entry.emotion === 'Overwhelmed'
                                ? '😵'
                                : entry.emotion === 'Tired'
                                ? '😴'
                                : '😫'}
                            </span>
                            <div>
                              <div className="font-semibold text-foreground">{entry.emotion}</div>
                              <div className="text-xs text-muted-foreground">
                                {entryDate.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-primary">{entry.emotion_level}</div>
                            <div className="text-xs text-muted-foreground">Intensity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-secondary">{entry.energy_level}</div>
                            <div className="text-xs text-muted-foreground">Energy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-accent">{entry.focus_level}</div>
                            <div className="text-xs text-muted-foreground">Focus</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
