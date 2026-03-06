import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, Chrome } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if the logged in user is the authorized admin
      if (user.email === 'medhat.safari@gmail.com' && user.emailVerified) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else if (user.email === 'medhat.safari@gmail.com' && !user.emailVerified) {
        setError('Access denied. Your email must be verified to access the management portal.');
        await auth.signOut();
      } else {
        setError('Access denied. This account is not authorized to access the management portal.');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-12 rounded-[2rem] w-full max-w-md border border-white/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-aviation-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-aviation-gold" />
          </div>
          <h2 className="text-3xl font-display font-bold">Admin Login</h2>
          <p className="text-white/50 mt-2">Access the AcesAds Aero management portal</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-aviation-gold transition-colors active:scale-[0.98] transform flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs">
            Authorized personnel only. Access restricted to medhat.safari@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
