import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Star, MapPin, Plus, X } from 'lucide-react';
import { TravelProposal } from '../../types';
import { ImageUpload } from '../ui/ImageUpload';

interface AccommodationSectionProps {
  data: TravelProposal['accommodation'];
  onChange: (data: TravelProposal['accommodation']) => void;
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({ data, onChange }) => {
  const [newAmenity, setNewAmenity] = useState('');

  const addAmenity = () => {
    if (newAmenity.trim()) {
      onChange({ ...data, amenities: [...data.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    onChange({ ...data, amenities: data.amenities.filter((_, i) => i !== index) });
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...data.photos];
    newPhotos[index] = value;
    onChange({ ...data, photos: newPhotos });
  };

  return (
    <div className="space-y-6">
      {/* Hotel Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Hotel className="inline-block w-4 h-4 mr-2" />
          Nome do Hotel/Resort *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="ex: Four Seasons Resort Maldives"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Room Type & Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🛏️ Tipo de Quarto
          </label>
          <input
            type="text"
            value={data.roomType}
            onChange={(e) => onChange({ ...data, roomType: e.target.value })}
            placeholder="ex: Suite Presidencial com Vista Mar"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline-block w-4 h-4 mr-2" />
            Localização
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            placeholder="ex: Baa Atoll, Maldivas"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Stars & Rating */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="inline-block w-4 h-4 mr-2" />
            Classificação (Estrelas)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange({ ...data, stars: star })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  star <= data.stars
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                }`}
              >
                <Star size={20} fill={star <= data.stars ? 'currentColor' : 'none'} />
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📊 Avaliação (0-10)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={data.rating}
              onChange={(e) => onChange({ ...data, rating: parseFloat(e.target.value) })}
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer accent-primary"
            />
            <span className="w-12 text-center font-bold text-lg text-primary">{data.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 Descrição
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Descreva o hotel, seus diferenciais e o que o torna especial..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ✨ Comodidades
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            placeholder="ex: 🏊 Piscina Infinita, 🍽️ Restaurante..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addAmenity}
            className="px-4 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <Plus size={20} />
          </motion.button>
        </div>
        <AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg group"
              >
                <span className="text-sm">{amenity}</span>
                <button
                  onClick={() => removeAmenity(index)}
                  className="w-5 h-5 rounded-full bg-primary/20 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          📸 Fotos do Hotel (2)
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <ImageUpload
              key={index}
              value={data.photos[index] || ''}
              onChange={(value) => handlePhotoChange(index, value)}
              aspectRatio="video"
              placeholder={`Foto ${index + 1} do hotel`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccommodationSection;
