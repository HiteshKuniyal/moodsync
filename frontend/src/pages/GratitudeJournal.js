import React, { useState, useEffect } from 'react';
import { Heart, Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../utils/api';

const GratitudeJournal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await apiClient.get('/gratitude/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) {
      toast.error('Please write something you\'re grateful for');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/gratitude/add', {
        content: newEntry,
        date: new Date().toISOString()
      });
      setEntries([response.data, ...entries]);
      setNewEntry('');
      toast.success('Gratitude entry saved!');
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/gratitude/delete/${id}`);
      setEntries(entries.filter(e => e.id !== id));
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 mb-6">
            <Heart className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Daily Gratitude Journal
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cultivate positivity by acknowledging the good in your life. Studies show daily gratitude practice improves mental health and happiness.
          </p>
        </div>

        {/* New Entry Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-soft border border-border mb-8">
          <h2 className="text-xl font-playfair font-semibold text-foreground mb-4">
            What are you grateful for today?
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="I'm grateful for..."
              rows={4}
              className="w-full p-4 rounded-2xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              data-testid="gratitude-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-lg disabled:opacity-50"
              data-testid="submit-gratitude-btn"
            >
              <Plus className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Add Entry'}</span>
            </button>
          </form>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6">
            Your Gratitude Journey ({entries.length} entries)
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-3xl border border-border">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No entries yet. Start your gratitude practice today!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border hover:shadow-float transition-all"
                data-testid={`gratitude-entry-${entry.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    data-testid={`delete-entry-${entry.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <p className="text-foreground leading-relaxed">{entry.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-3xl p-8 border border-rose-500/20">
          <h3 className="text-xl font-playfair font-semibold text-foreground mb-4">
            Benefits of Daily Gratitude
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Increases happiness and life satisfaction by 25%</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Reduces depression and anxiety symptoms</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Improves sleep quality and duration</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">Strengthens relationships and social connections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournal;
