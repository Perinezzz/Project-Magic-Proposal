import React from 'react';
import { User, Briefcase, Phone, Mail } from 'lucide-react';
import { TravelProposal } from '../../types';

interface ConsultantSectionProps {
  data: TravelProposal['consultant'];
  onChange: (data: TravelProposal['consultant']) => void;
}

export const ConsultantSection: React.FC<ConsultantSectionProps> = ({ data, onChange }) => {
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline-block w-4 h-4 mr-2" />
            Nome do Consultor *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="João Silva"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline-block w-4 h-4 mr-2" />
            Cargo
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Consultor de Viagens"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline-block w-4 h-4 mr-2" />
            Telefone / WhatsApp *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: formatPhone(e.target.value) })}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline-block w-4 h-4 mr-2" />
            E-mail
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="consultor@agencia.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Preview Card */}
      {(data.name || data.title || data.phone || data.email) && (
        <div className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Preview do Cartão</p>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">{data.name || 'Nome do Consultor'}</h4>
              <p className="text-sm text-gray-500">{data.title || 'Cargo'}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                {data.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} className="text-primary" />
                    {data.phone}
                  </span>
                )}
                {data.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={14} className="text-primary" />
                    {data.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantSection;
