import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email');
  const [step, setStep] = useState(1); // 1: enter details, 2: verify OTP
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState(''); // For demo purposes

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const identifier = loginMethod === 'email' ? email : phone;
      const response = await axios.post(`${API}/auth/send-otp`, {
        identifier,
        method: loginMethod
      });

      // Handle demo mode (when email service not configured)
      if (response.data.status === 'demo_mode' && response.data.otp) {
        setDemoOtp(response.data.otp);
        toast.warning(response.data.message);
      } else if (response.data.status === 'success') {
        toast.success(response.data.message);
        setDemoOtp(''); // Clear any previous demo OTP
      } else {
        toast.success(response.data.message);
      }
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const identifier = loginMethod === 'email' ? email : phone;
      const response = await axios.post(`${API}/auth/verify-otp`, {
        identifier,
        otp,
        name
      });

      const user = {
        name: name,
        email: loginMethod === 'email' ? email : null,
        phone: loginMethod === 'phone' ? phone : null,
        verified: true
      };

      localStorage.setItem('moodSyncUser', JSON.stringify(user));
      toast.success('Login successful!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-4 md:px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2 text-center">
            {step === 1 ? 'Welcome to Mood Sync' : 'Verify OTP'}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {step === 1 ? 'Login is optional. You can use the app without an account.' : 'Enter the OTP sent to your ' + loginMethod}
          </p>

          {step === 1 ? (
            <>
              {/* Login Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    loginMethod === 'email' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Gmail</span>
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    loginMethod === 'phone' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Mobile</span>
                </button>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                {loginMethod === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Gmail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <button
                onClick={skipLogin}
                className="w-full mt-4 py-3 bg-white border border-border text-foreground rounded-xl font-medium hover:bg-muted/50 transition-all"
              >
                Continue Without Login
              </button>
            </>
          ) : (
            <>
              {demoOtp && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700 mb-1 font-semibold">⚠️ Demo Mode - Email Service Not Configured</p>
                  <p className="text-sm text-amber-800 font-medium">Your OTP: <span className="text-2xl font-bold tracking-wider">{demoOtp}</span></p>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="000000"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-2xl font-bold tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-4 py-3 bg-white border border-border text-foreground rounded-xl font-medium hover:bg-muted/50 transition-all"
              >
                Back
              </button>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground mt-6">
            {step === 1 ? 'Logging in enables data sync and personalized features' : 'OTP valid for 5 minutes'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
