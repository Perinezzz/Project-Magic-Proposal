import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, CloudSun, Languages, Coins, Sparkles, Plus, X, Image as ImageIcon, Wand2 } from 'lucide-react';
import { TravelProposal } from '../../types';
import { ImageUpload } from '../ui/ImageUpload';

interface AboutSectionProps {
  data: TravelProposal['about'];
  onChange: (data: TravelProposal['about']) => void;
  isLoadingAI?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data, onChange, isLoadingAI = false }) => {
  const [newHighlight, setNewHighlight] = useState('');

  const addHighlight = () => {
    if (newHighlight.trim()) {
      onChange({ ...data, highlights: [...data.highlights, newHighlight.trim()] });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    onChange({ ...data, highlights: data.highlights.filter((_, i) => i !== index) });
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...data.photos];
    newPhotos[index] = value;
    onChange({ ...data, photos: newPhotos });
  };

  const addPhoto = () => {
    if (data.photos.length < 3) {
      onChange({ ...data, photos: [...data.photos, ''] });
    }
  };

  const removePhoto = (index: number) => {
    onChange({ ...data, photos: data.photos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline-block w-4 h-4 mr-2" />
          Descrição do Destino *
          {isLoadingAI && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 inline-flex items-center gap-1 text-primary"
            >
              <Wand2 className="w-4 h-4 animate-pulse" />
              <span className="text-xs">IA gerando...</span>
            </motion.span>
          )}
        </label>
        <div className="relative">
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Descreva a magia deste destino... O que torna este lugar especial? Quais experiências únicas aguardam?"
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${isLoadingAI ? 'bg-gradient-to-r from-purple-50 to-blue-50 animate-pulse' : ''}`}
            disabled={isLoadingAI}
          />
          {isLoadingAI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border border-primary/20">
                <Wand2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm font-medium text-gray-700">Gerando com IA...</span>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            {isLoadingAI ? '✨ A IA está escrevendo para você...' : 'Mínimo: 100 caracteres'}
          </span>
          <span className={`text-xs ${data.description.length < 100 ? 'text-orange-500' : 'text-gray-400'}`}>
            {data.description.length}/500
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CloudSun className="inline-block w-4 h-4 mr-2" />
            Clima
          </label>
          <input
            type="text"
            value={data.climate}
            onChange={(e) => onChange({ ...data, climate: e.target.value })}
            placeholder="ex: Tropical, 25-30°C"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 Melhor Época
          </label>
          <input
            type="text"
            value={data.bestSeason}
            onChange={(e) => onChange({ ...data, bestSeason: e.target.value })}
            placeholder="ex: Abril a Outubro"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Languages className="inline-block w-4 h-4 mr-2" />
            Idioma
          </label>
          <input
            type="text"
            value={data.language}
            onChange={(e) => onChange({ ...data, language: e.target.value })}
            placeholder="ex: Inglês, Francês"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Coins className="inline-block w-4 h-4 mr-2" />
            Moeda
          </label>
          <input
            type="text"
            value={data.currency}
            onChange={(e) => onChange({ ...data, currency: e.target.value })}
            placeholder="ex: Euro (EUR)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Sparkles className="inline-block w-4 h-4 mr-2" />
          Destaques do Destino
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            placeholder="ex: 🏖️ Praias paradisíacas"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addHighlight}
            className="px-4 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <Plus size={20} />
          </motion.button>
        </div>
        <AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {data.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg group"
              >
                <span className="text-sm">{highlight}</span>
                <button
                  onClick={() => removeHighlight(index)}
                  className="w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Curiosities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💡 Curiosidades
        </label>
        <textarea
          value={data.curiosities}
          onChange={(e) => onChange({ ...data, curiosities: e.target.value })}
          placeholder="Fatos interessantes sobre o destino que vão encantar o cliente..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Extra Photos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            <ImageIcon className="inline-block w-4 h-4 mr-2" />
            Fotos Extras (máx. 3)
          </label>
          {data.photos.length < 3 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addPhoto}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              <Plus size={16} />
              Adicionar Foto
            </motion.button>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {data.photos.map((photo, index) => (
            <div key={index} className="relative">
              <ImageUpload
                value={photo}
                onChange={(value) => handlePhotoChange(index, value)}
                aspectRatio="square"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
