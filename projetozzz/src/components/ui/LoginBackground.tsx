import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginBackgroundProps {
  className?: string;
}

// 10 destinos famosos para rotação - armazenados no servidor backend
const destinations = [
  { url: 'http://localhost:3001/public/images/destinations/paris.jpg', name: 'Paris', fallback: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/tokyo.jpg', name: 'Tokyo', fallback: 'https://images.unsplash.com/photo-1540959375944-7049f642e9c1?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/bali.jpg', name: 'Bali', fallback: 'https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/newyork.jpg', name: 'New York', fallback: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/dubai.jpg', name: 'Dubai', fallback: 'https://images.unsplash.com/photo-1518684079-7c8587dc0ee1?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/barcelona.jpg', name: 'Barcelona', fallback: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/amsterdam.jpg', name: 'Amsterdam', fallback: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/santorini.jpg', name: 'Santorini', fallback: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/bangkok.jpg', name: 'Bangkok', fallback: 'https://images.unsplash.com/photo-1552465881-721a1215a052?w=1920&h=1080&fit=crop' },
  { url: 'http://localhost:3001/public/images/destinations/sydney.jpg', name: 'Sydney', fallback: 'https://images.unsplash.com/photo-1506973404872-a4a41e01b47e?w=1920&h=1080&fit=crop' },
];

export const LoginBackground: React.FC<LoginBackgroundProps> = ({ className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imagesMapRef = useRef<Map<number, string>>(new Map());

  // Precarregar a imagem e armazenar seu data URL
  const preloadAllImages = async () => {
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      try {
        const response = await fetch(dest.url);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          imagesMapRef.current.set(i, url);
        } else {
          // Fallback se falhar
          const fallbackResponse = await fetch(dest.fallback);
          if (fallbackResponse.ok) {
            const blob = await fallbackResponse.blob();
            const url = URL.createObjectURL(blob);
            imagesMapRef.current.set(i, url);
          }
        }
      } catch (error) {
        console.warn(`Erro ao precarregar ${dest.name}:`, error);
      }
    }
  };

  // Precarregar todas as imagens ao montar
  useEffect(() => {
    preloadAllImages();
  }, []);

  // Rotação automática a cada 8 segundos
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % destinations.length);
      }, 8000);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentImageIndex]);

  const currentDestination = destinations[currentImageIndex];
  const nextImageIndex = (currentImageIndex + 1) % destinations.length;
  const nextDestination = destinations[nextImageIndex];

  // Obter a imagem precarregada ou fallback
  const getCurrentImageUrl = () => {
    return imagesMapRef.current.get(currentImageIndex) || currentDestination.fallback;
  };

  const getNextImageUrl = () => {
    return imagesMapRef.current.get(nextImageIndex) || nextDestination.fallback;
  };

  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-gray-900 ${className}`}>
      {/* Container de imagens com altura fixa */}
      <div className='relative w-full h-screen overflow-hidden'>
        <AnimatePresence mode='wait'>
          {/* Imagem Atual (Sai para esquerda) */}
          <motion.img
            key={`img-${currentImageIndex}`}
            src={getCurrentImageUrl()}
            alt={currentDestination.name}
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -1920, opacity: 0.5 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className='absolute inset-0 w-full h-full object-cover'
          />

          {/* Imagem Próxima (Entra da direita) */}
          <motion.img
            key={`next-${currentImageIndex}`}
            src={getNextImageUrl()}
            alt={nextDestination.name}
            initial={{ x: 1920, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className='absolute inset-0 w-full h-full object-cover'
            onAnimationComplete={() => {
              // Atualizar para próxima imagem após animação
              setCurrentImageIndex((prev) => (prev + 1) % destinations.length);
            }}
          />
        </AnimatePresence>

        {/* Overlay escuro */}
        <div className='absolute inset-0 bg-black/40 z-5' />

        {/* Indicador de destino */}
        <div className='absolute bottom-4 left-4 text-white text-xs font-medium z-10'>
          <p className='text-lg font-semibold'>{currentDestination.name}</p>
          <p className='text-gray-300'>{currentImageIndex + 1} / {destinations.length}</p>
        </div>
      </div>
    </div>
  );
};
