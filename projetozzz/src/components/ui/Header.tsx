import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn, Eye, EyeOff, Loader, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, login, logout, isLoading, error } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('perine@demo.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('loading');

    const success = await login({ email, password });

    if (success) {
      setLoginStatus('success');
      setShowLoginForm(false);
      setTimeout(() => setLoginStatus('idle'), 2000);
    } else {
      setLoginStatus('error');
      setTimeout(() => setLoginStatus('idle'), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLoginForm(false);
    setEmail('perine@demo.com');
    setPassword('admin');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-700 shadow-xl'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='flex items-center gap-3'
        >
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>✈️</span>
          </div>
          <div>
            <h1 className='text-white font-bold text-lg'>Travel Proposal</h1>
            <p className='text-xs text-slate-400'>Professional Proposals</p>
          </div>
        </motion.div>

        {/* Right Side - Auth */}
        <div className='flex items-center gap-4'>
          {user ? (
            // Logged In State
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center gap-4'
            >
              <div className='flex items-center gap-3'>
                <div className='text-right hidden sm:block'>
                  <p className='text-white font-medium text-sm'>{user.name}</p>
                  <p className='text-xs text-slate-400 capitalize'>{user.role}</p>
                </div>
                <div
                  className='w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg'
                  title={user.email}
                >
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors'
                title='Fazer logout'
              >
                <LogOut size={16} />
                <span className='hidden sm:inline'>Sair</span>
              </motion.button>
            </motion.div>
          ) : (
            // Not Logged In State - Empty (no login button in header)
            null
          )}
        </div>
      </div>
    </header>
  );
};