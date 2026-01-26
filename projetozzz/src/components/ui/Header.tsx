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
            // Not Logged In State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='relative'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginForm(!showLoginForm)}
                className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-lg text-sm font-medium transition-colors'
              >
                <LogIn size={16} />
                <span className='hidden sm:inline'>Entrar</span>
              </motion.button>

              {/* Login Dropdown Form */}
              <AnimatePresence>
                {showLoginForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className='absolute top-full right-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 backdrop-blur'
                  >
                    <h2 className='text-white font-bold mb-4'>Fazer Login</h2>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-sm text-red-300'
                      >
                        <AlertCircle size={16} className='mt-0.5 flex-shrink-0' />
                        <p>{error}</p>
                      </motion.div>
                    )}

                    <form onSubmit={handleLogin} className='space-y-4'>
                      {/* Email Input */}
                      <div>
                        <label className='block text-xs font-medium text-slate-300 mb-2'>
                          Email
                        </label>
                        <input
                          type='email'
                          id='login-email'
                          name='email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder='seu@email.com'
                          disabled={loginStatus === 'loading'}
                          className='w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary disabled:opacity-50'
                        />
                        <p className='text-xs text-slate-500 mt-1'>Demo: perine@demo.com</p>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label className='block text-xs font-medium text-slate-300 mb-2'>
                          Senha
                        </label>
                        <div className='relative'>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id='login-password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='sua senha'
                            disabled={loginStatus === 'loading'}
                            className='w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary disabled:opacity-50'
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300'
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className='text-xs text-slate-500 mt-1'>Demo: admin</p>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type='submit'
                        disabled={loginStatus === 'loading'}
                        className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                          loginStatus === 'success'
                            ? 'bg-green-600 text-white'
                            : loginStatus === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-primary hover:bg-opacity-90 text-white'
                        } disabled:opacity-50`}
                      >
                        {loginStatus === 'loading' && (
                          <Loader size={16} className='animate-spin' />
                        )}
                        {loginStatus === 'success' && (
                          <Check size={16} />
                        )}
                        {loginStatus === 'error' && (
                          <AlertCircle size={16} />
                        )}
                        {loginStatus === 'idle' && 'Entrar'}
                        {loginStatus === 'loading' && 'Entrando...'}
                        {loginStatus === 'success' && 'Sucesso!'}
                        {loginStatus === 'error' && 'Erro'}
                      </motion.button>

                      {/* Demo Credentials */}
                      <div className='pt-2 border-t border-slate-700'>
                        <p className='text-xs text-slate-400 mb-2'>🧪 Credenciais Demo:</p>
                        <p className='text-xs text-slate-300'>Email: perine@demo.com</p>
                        <p className='text-xs text-slate-300'>Senha: admin</p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};