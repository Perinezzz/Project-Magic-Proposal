import React from 'react';
import { DollarSign, Users, FileText, CreditCard } from 'lucide-react';
import { TravelProposal } from '../../types';
import { formatCurrency, parseCurrencyInput } from '../../services/storage';

interface InvestmentSectionProps {
  data: TravelProposal['investment'];
  onChange: (data: TravelProposal['investment']) => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ data, onChange }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue, 10) / 100 || 0;
    onChange({ ...data, price: numericValue });
  };

  const displayPrice = data.price > 0 ? formatCurrency(data.price) : '';

  return (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline-block w-4 h-4 mr-2" />
          Valor Total do Pacote *
        </label>
        <div className="relative">
          <input
            type="text"
            value={displayPrice}
            onChange={handlePriceChange}
            placeholder="R$ 0,00"
            className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-2xl font-bold text-primary"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Digite apenas números - formatação automática
        </p>
      </div>

      {/* Travelers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="inline-block w-4 h-4 mr-2" />
          Número de Viajantes
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => data.travelers > 1 && onChange({ ...data, travelers: data.travelers - 1 })}
            className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <span className="text-4xl font-bold text-gray-800">{data.travelers}</span>
            <p className="text-sm text-gray-400">
              {data.travelers === 1 ? 'viajante' : 'viajantes'}
            </p>
          </div>
          <button
            onClick={() => onChange({ ...data, travelers: data.travelers + 1 })}
            className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Price per person (calculated) */}
      {data.price > 0 && data.travelers > 0 && (
        <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Valor por pessoa</p>
          <p className="text-xl font-bold gradient-text">
            {formatCurrency(data.price / data.travelers)}
          </p>
        </div>
      )}

      {/* Special Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline-block w-4 h-4 mr-2" />
          Condições Especiais
        </label>
        <textarea
          value={data.conditions}
          onChange={(e) => onChange({ ...data, conditions: e.target.value })}
          placeholder="ex: Válido para reservas até 15/12. Sujeito a disponibilidade. Não reembolsável após confirmação..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Installments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="inline-block w-4 h-4 mr-2" />
          Parcelamento
        </label>
        <select
          value={data.installments}
          onChange={(e) => onChange({ ...data, installments: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
        >
          <option value="">Selecione uma opção</option>
          <option value="À vista com 5% de desconto">💰 À vista com 5% de desconto</option>
          <option value="2x sem juros">2x sem juros</option>
          <option value="3x sem juros">3x sem juros</option>
          <option value="4x sem juros">4x sem juros</option>
          <option value="5x sem juros">5x sem juros</option>
          <option value="6x sem juros">6x sem juros</option>
          <option value="10x sem juros">10x sem juros</option>
          <option value="12x sem juros">12x sem juros</option>
          <option value="Entrada + parcelas">📋 Entrada + parcelas (personalizado)</option>
        </select>

        {data.installments === 'Entrada + parcelas' && (
          <textarea
            placeholder="Descreva as condições de parcelamento personalizadas..."
            className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            rows={2}
          />
        )}
      </div>

      {/* Summary Card */}
      {data.price > 0 && (
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Resumo do Investimento</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Valor total</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {formatCurrency(data.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Viajantes</span>
              <span>{data.travelers} pessoa{data.travelers !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Por pessoa</span>
              <span className="font-semibold">{formatCurrency(data.price / data.travelers)}</span>
            </div>
            {data.installments && (
              <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <span className="text-gray-400">Parcelamento</span>
                <span className="text-sm">{data.installments}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentSection;
