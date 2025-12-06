import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Palette } from 'lucide-react';
import { TravelProposal, THEME_PRESETS, AgencyTheme } from '../../types';
import { ImageUpload } from '../ui/ImageUpload';
import { applyTheme } from '../../services/storage';

interface AgencySectionProps {
  data: TravelProposal['agency'];
  onChange: (data: TravelProposal['agency']) => void;
}

export const AgencySection: React.FC<AgencySectionProps> = ({ data, onChange }) => {
  const handleThemeChange = (theme: AgencyTheme) => {
    onChange({ ...data, theme });
    applyTheme(theme);
  };

  const handleCustomColorChange = (field: keyof AgencyTheme, value: string) => {
    const updatedTheme = { ...data.theme, [field]: value };
    onChange({ ...data, theme: updatedTheme });
    applyTheme(updatedTheme);
  };

  return (
    <div className="space-y-6">
      {/* Agency Name & Slogan */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Agência *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Minha Agência de Viagens"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slogan <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={data.slogan || ''}
            onChange={(e) => onChange({ ...data, slogan: e.target.value })}
            placeholder="Realizando sonhos de viagem"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building2 className="inline-block w-4 h-4 mr-2" />
          Logo da Agência
        </label>
        <ImageUpload
          value={data.logo || ''}
          onChange={(logo) => onChange({ ...data, logo })}
          aspectRatio="video"
          placeholder="Upload do logo (recomendado: PNG transparente)"
        />
      </div>

      {/* Theme Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Palette className="inline-block w-4 h-4 mr-2" />
          Tema de Cores
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {THEME_PRESETS.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleThemeChange(theme)}
              className={`p-4 rounded-xl border-2 transition-all ${
                data.theme.id === theme.id
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg shadow-inner"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-8 h-8 rounded-lg shadow-inner"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 block truncate">
                {theme.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers (show when custom theme is selected) */}
      {data.theme.id === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl"
        >
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Primária</label>
            <input
              type="color"
              value={data.theme.primary}
              onChange={(e) => handleCustomColorChange('primary', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Primária Clara</label>
            <input
              type="color"
              value={data.theme.primaryLight}
              onChange={(e) => handleCustomColorChange('primaryLight', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Destaque</label>
            <input
              type="color"
              value={data.theme.accent}
              onChange={(e) => handleCustomColorChange('accent', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Destaque Clara</label>
            <input
              type="color"
              value={data.theme.accentLight}
              onChange={(e) => handleCustomColorChange('accentLight', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </motion.div>
      )}

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Preview</h4>
        <div className="flex items-center gap-4">
          {data.logo ? (
            <img src={data.logo} alt="Logo" className="w-16 h-16 object-contain rounded-xl bg-white/10 p-2" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 size={24} className="text-gray-400" />
            </div>
          )}
          <div>
            <h3
              className="text-xl font-bold"
              style={{ color: data.theme.primary }}
            >
              {data.name || 'Nome da Agência'}
            </h3>
            {data.slogan && (
              <p
                className="text-sm"
                style={{ color: data.theme.accent }}
              >
                {data.slogan}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: data.theme.primary }}
          >
            Botão Primário
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: data.theme.accent, color: '#1F2937' }}
          >
            Botão Destaque
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgencySection;
