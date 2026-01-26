import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Sparkles } from 'lucide-react';
import { LoginBackground } from '../components/ui/LoginBackground';

export const LoginPage: React.FC = () => {
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
        className='relative z-10 text-center text-white px-4 max-w-lg'
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

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='space-y-4 mb-10 text-left'
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
              transition={{ delay: 0.5 + index * 0.1 }}
              className='flex items-center gap-3 text-gray-100'
            >
              <span className='text-2xl'>{feature.split(' ')[0]}</span>
              <span>{feature.split(' ').slice(1).join(' ')}</span>
            </motion.p>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className='text-gray-300 flex items-center justify-center gap-2'
        >
          <Sparkles size={16} />
          Faça login no topo para começar
        </motion.p>
      </motion.div>
    </div>
  );
};
