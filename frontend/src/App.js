import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import MoodAssessment from './pages/MoodAssessment';
import Guidance from './pages/Guidance';
import History from './pages/History';
import Coaches from './pages/Coaches';
import Exercises from './pages/Exercises';
import Resources from './pages/Resources';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<MoodAssessment />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/history" element={<History />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
