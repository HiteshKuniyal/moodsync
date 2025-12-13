import React from 'react';
import { Shield, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuestProtection = ({ feature = "this feature" }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
        <Shield className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Login to Access {feature}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Create a free account to save your data privately and access personalized insights. Your wellness journey is completely private and secure.
      </p>
      <Link
        to="/login"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg"
      >
        <LogIn className="w-4 h-4" />
        <span>Login / Sign Up</span>
      </Link>
      <p className="text-xs text-muted-foreground mt-4">
        Or continue as guest (data won't be saved)
      </p>
    </div>
  );
};

export default GuestProtection;
