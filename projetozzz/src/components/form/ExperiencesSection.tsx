import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { TravelProposal, Experience } from '../../types';

interface ExperiencesSectionProps {
  enabled: boolean;
  data: Experience[];
  onToggle: (enabled: boolean) => void;
  onChange: (data: Experience[]) => void;
}

const EMOJI_SUGGESTIONS = ['🏄', '🎢', '🏔️', '🚤', '🧘', '🍷', '🎭', '🏛️', '🌅', '🐢', '🎣', '🚁', '🛶', '⛵', '🎪'];

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  enabled,
  data,
  onToggle,
  onChange,
}) => {
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏄');
  const [newDescription, setNewDescription] = useState('');

  const addExperience = () => {
    if (newName.trim()) {
      onChange([...data, { name: newName.trim(), emoji: newEmoji, description: newDescription.trim() }]);
      setNewName('');
      setNewDescription('');
    }
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={() => onToggle(!enabled)}
        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
          enabled
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <Compass className={`w-6 h-6 ${enabled ? 'text-primary' : 'text-gray-400'}`} />
          <div className="text-left">
            <h4 className={`font-semibold ${enabled ? 'text-gray-900' : 'text-gray-600'}`}>
              Incluir Experiências
            </h4>
            <p className="text-sm text-gray-500">Passeios e atividades especiais</p>
          </div>
        </div>
        {enabled ? (
          <ToggleRight className="w-10 h-10 text-primary" />
        ) : (
          <ToggleLeft className="w-10 h-10 text-gray-300" />
        )}
      </motion.button>

      {/* Experiences List */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Add New Experience */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="grid md:grid-cols-12 gap-3">
                {/* Emoji Selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Emoji</label>
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xl text-center bg-white"
                  >
                    {EMOJI_SUGGESTIONS.map((emoji) => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                </div>
                
                {/* Name */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nome da Experiência</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ex: Mergulho com Golfinhos"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                
                {/* Description */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Descrição (opcional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExperience())}
                      placeholder="Breve descrição..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addExperience}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Cards */}
            <div className="grid md:grid-cols-2 gap-3">
              <AnimatePresence>
                {data.map((experience, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 bg-white rounded-xl border border-gray-200 group hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{experience.emoji}</span>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{experience.name}</h5>
                        {experience.description && (
                          <p className="text-sm text-gray-500 mt-1">{experience.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeExperience(index)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {data.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Compass className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma experiência adicionada ainda</p>
                <p className="text-sm">Adicione passeios e atividades especiais!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperiencesSection;
