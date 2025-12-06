import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, X, Car, Bus, Hotel, Coffee, Utensils, Plane, CreditCard, Shield } from 'lucide-react';
import { TravelProposal } from '../../types';

interface InclusionsSectionProps {
  data: TravelProposal['inclusions'];
  onChange: (data: TravelProposal['inclusions']) => void;
}

const inclusionItems = [
  { key: 'carRental', label: 'Carro Aluguel', icon: Car, emoji: '🚗' },
  { key: 'airportTransfer', label: 'Transfer Aeroporto', icon: Bus, emoji: '🚐' },
  { key: 'tourTransfer', label: 'Transfer Passeios', icon: Bus, emoji: '🚐' },
  { key: 'accommodation', label: 'Hospedagem', icon: Hotel, emoji: '🏨' },
  { key: 'breakfast', label: 'Café da Manhã', icon: Coffee, emoji: '☕' },
  { key: 'meals', label: 'Refeições', icon: Utensils, emoji: '🍽️' },
  { key: 'flights', label: 'Voos', icon: Plane, emoji: '✈️' },
  { key: 'taxes', label: 'Taxas Inclusas', icon: CreditCard, emoji: '💳' },
  { key: 'insurance', label: 'Seguro Viagem', icon: Shield, emoji: '🛡️' },
];

export const InclusionsSection: React.FC<InclusionsSectionProps> = ({ data, onChange }) => {
  const [newItem, setNewItem] = useState('');

  const handleToggle = (key: string) => {
    onChange({ ...data, [key]: !data[key as keyof typeof data] });
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      onChange({ ...data, customItems: [...data.customItems, newItem.trim()] });
      setNewItem('');
    }
  };

  const removeCustomItem = (index: number) => {
    onChange({ ...data, customItems: data.customItems.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Package className="w-5 h-5" />
        <span className="text-sm">Selecione o que está incluído no pacote</span>
      </div>

      {/* Main Inclusions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {inclusionItems.map((item) => {
          const isChecked = data[item.key as keyof typeof data] as boolean;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle(item.key)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isChecked
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isChecked ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <span className="text-lg">{item.emoji}</span>
                  <p className={`text-sm font-medium ${isChecked ? 'text-gray-900' : 'text-gray-600'}`}>
                    {item.label}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isChecked 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-300'
                }`}>
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Car Rental Category (conditional) */}
      <AnimatePresence>
        {data.carRental && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🚗 Categoria do Veículo
              </label>
              <select
                value={data.carCategory || ''}
                onChange={(e) => onChange({ ...data, carCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
              >
                <option value="">Selecione a categoria</option>
                <option value="Econômico">Econômico (ex: Fiat Mobi)</option>
                <option value="Compacto">Compacto (ex: VW Polo)</option>
                <option value="Intermediário">Intermediário (ex: Toyota Corolla)</option>
                <option value="SUV">SUV (ex: Jeep Compass)</option>
                <option value="Premium">Premium (ex: BMW Série 3)</option>
                <option value="Luxo">Luxo (ex: Mercedes E-Class)</option>
                <option value="Minivan">Minivan (ex: Chevrolet Spin)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ➕ Itens Adicionais
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem())}
            placeholder="ex: 🎫 Ingressos para parques, 🎿 Aulas de ski..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCustomItem}
            className="px-4 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <Plus size={20} />
          </motion.button>
        </div>
        <AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {data.customItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent rounded-lg group"
                style={{ color: 'var(--color-primary)' }}
              >
                <span className="text-sm">{item}</span>
                <button
                  onClick={() => removeCustomItem(index)}
                  className="w-5 h-5 rounded-full bg-accent/20 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InclusionsSection;
