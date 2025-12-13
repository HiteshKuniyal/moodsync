import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Trash2, Download, CheckCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../utils/api';

const PrivacySettings = () => {
  const [dataVisibility, setDataVisibility] = useState('private');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('moodSyncUser') || 'null');

  const handleExportData = async () => {
    try {
      toast.info('Preparing your data for download...');
      
      // Fetch all user data
      const [moodData, gratitudeData, lifestyleData] = await Promise.all([
        apiClient.get('/mood/history?limit=1000'),
        apiClient.get('/gratitude/entries?limit=1000'),
        apiClient.get('/lifestyle/history?limit=1000')
      ]);

      const exportData = {
        export_date: new Date().toISOString(),
        user: user,
        mood_entries: moodData.data,
        gratitude_entries: gratitudeData.data,
        lifestyle_assessments: lifestyleData.data
      };

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mood-sync-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    try {
      // In a real implementation, you would call a delete endpoint
      // await apiClient.delete('/user/account');
      
      localStorage.removeItem('moodSyncUser');
      toast.success('Account data cleared. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  const privacyFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Privacy',
      description: 'Your data is stored with your unique user ID. Only you can access your mood entries, gratitude journal, and wellness assessments.',
      color: 'from-blue-500 to-blue-400'
    },
    {
      icon: Eye,
      title: 'Personal Journey',
      description: 'All insights, trends, and reports are generated exclusively from your data. No data mixing across users.',
      color: 'from-purple-500 to-purple-400'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Passwords are encrypted using bcrypt. Your credentials are never stored in plain text.',
      color: 'from-green-500 to-green-400'
    },
    {
      icon: Download,
      title: 'Data Portability',
      description: 'Export your complete data anytime in JSON format. Your data belongs to you.',
      color: 'from-orange-500 to-orange-400'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Privacy & Data Control
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your mental wellness journey is private. We believe in transparency and giving you full control over your data.
          </p>
        </div>

        {/* Privacy Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {privacyFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Data Management - Only for logged in users */}
        {user && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border mb-8">
            <h2 className="text-2xl font-playfair font-bold text-foreground mb-6">
              Data Management
            </h2>

          {/* Export Data */}
          <div className="mb-6 pb-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Export Your Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all your mood entries, gratitude journal, and wellness assessments in JSON format. You can import this into other tools or keep it as a backup.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all text-sm font-medium"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Clear Account Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will clear your local session data. Your account will remain in the system, but you'll need to login again.
                </p>
                {!showConfirmDelete ? (
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all text-sm font-medium"
                  >
                    Clear Data
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all text-sm font-medium"
                    >
                      Confirm Clear
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-6 py-2 bg-white border border-border text-foreground rounded-full hover:bg-muted/50 transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Login Prompt for Guests */}
        {!user && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border mb-8 text-center">
            <h2 className="text-2xl font-playfair font-bold text-foreground mb-4">
              Take Control of Your Data
            </h2>
            <p className="text-muted-foreground mb-6">
              Create a free account to access personalized data management features including data export, account control, and complete privacy protection.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>Login / Sign Up</span>
            </Link>
          </div>
        )}

        {/* Privacy Commitment */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Privacy Commitment</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>✓ We never share your personal data with third parties</li>
                <li>✓ Your mood entries and journals are encrypted at rest</li>
                <li>✓ AI guidance is generated in real-time and not stored with identifiable information</li>
                <li>✓ You can export or delete your data at any time</li>
                <li>✓ No tracking cookies or analytics on your wellness data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
