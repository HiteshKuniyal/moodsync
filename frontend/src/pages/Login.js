import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = {
      name: name,
      email: loginMethod === 'email' ? email : null,
      phone: loginMethod === 'phone' ? phone : null,
      loginMethod: loginMethod
    };
    
    localStorage.setItem('moodSyncUser', JSON.stringify(user));
    toast.success('Welcome to Mood Sync!');
    navigate('/');
    window.location.reload(); // Reload to update Layout
  };

  const skipLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-96px)] py-12 px-4 md:px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2 text-center">
            Welcome to Mood Sync
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Login is optional. You can use the app without an account.
          </p>

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

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'email' ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg"
            >
              Continue
            </button>
          </form>

          <button
            onClick={skipLogin}
            className="w-full mt-4 py-3 bg-white border border-border text-foreground rounded-xl font-medium hover:bg-muted/50 transition-all"
          >
            Continue Without Login
          </button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Note: Logging in enables data sync and personalized features
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
