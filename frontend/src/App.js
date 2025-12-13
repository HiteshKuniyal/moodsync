import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import MoodAssessment from './pages/MoodAssessment';
import Guidance from './pages/Guidance';
import History from './pages/History';
import Coaches from './pages/Coaches';
import WellnessActivities from './pages/WellnessActivities';
import Resources from './pages/Resources';
import LifestyleAssessment from './pages/LifestyleAssessment';
import GratitudeJournal from './pages/GratitudeJournal';
import Login from './pages/Login';
import PrivacySettings from './pages/PrivacySettings';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { startReminderService } from './utils/notifications';
import './App.css';

function App() {
  useEffect(() => {
    // Start notification reminder service
    startReminderService();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/assessment" element={<MoodAssessment />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/history" element={<History />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/wellness-activities" element={<WellnessActivities />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/lifestyle-assessment" element={<LifestyleAssessment />} />
          <Route path="/gratitude" element={<GratitudeJournal />} />
          <Route path="/privacy" element={<PrivacySettings />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
