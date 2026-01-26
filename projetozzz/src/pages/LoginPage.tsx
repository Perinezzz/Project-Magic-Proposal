import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Mail, Lock, AlertCircle } from 'lucide-react';
import { LoginBackground } from '../components/ui/LoginBackground';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
      {/* Background com destinos */}
      <div className='absolute inset-0 w-full h-full'>
        <LoginBackground />
      </div>

      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='relative z-10 text-center text-white px-4 max-w-lg w-full'
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className='mb-6 inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl'
        >
          <Plane size={40} />
        </motion.div>

        {/* Title */}
        <h1 className='text-5xl md:text-6xl font-bold mb-4'>
          Travel Proposal
        </h1>

        {/* Subtitle */}
        <p className='text-xl text-gray-200 mb-8'>
          Crie propostas de viagem incríveis e profissionais em minutos
        </p>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8'
        >
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Email Input */}
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                required
                className='w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all'
              />
            </div>

            {/* Password Input */}
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Senha'
                required
                className='w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all'
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-2 text-red-300 bg-red-500/20 p-3 rounded-lg'
              >
                <AlertCircle size={20} />
                <span className='text-sm'>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
              {isLoading ? (
                <span className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-4 pt-4 border-t border-white/20'>
            <p className='text-xs text-gray-300 mb-2'>Credenciais de demonstração:</p>
            <p className='text-xs text-gray-400'>Email: perine@demo.com</p>
            <p className='text-xs text-gray-400'>Senha: admin</p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='space-y-3 text-left'
        >
          {[
            '✨ Propostas personalizadas com IA',
            '🎨 Designs profissionais e modernos',
            '📊 Análise completa de destinos',
            '🚀 Compartilhamento fácil com clientes'
          ].map((feature, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className='flex items-center gap-3 text-gray-100 text-sm'
            >
              <span className='text-xl'>{feature.split(' ')[0]}</span>
              <span>{feature.split(' ').slice(1).join(' ')}</span>
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
