import React from 'react';
import { Plane, Clock, MapPin } from 'lucide-react';
import { TravelProposal, Flight } from '../../types';

interface FlightsSectionProps {
  data: TravelProposal['flights'];
  onChange: (data: TravelProposal['flights']) => void;
}

const FlightForm: React.FC<{
  title: string;
  icon: React.ReactNode;
  flight: Flight;
  onChange: (flight: Flight) => void;
}> = ({ title, icon, flight, onChange }) => {
  return (
    <div className="p-5 bg-gray-50 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Companhia Aérea</label>
          <input
            type="text"
            value={flight.company || ''}
            onChange={(e) => onChange({ ...flight, company: e.target.value })}
            placeholder="ex: LATAM, GOL, Azul"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            <Clock className="inline-block w-3 h-3 mr-1" />
            Horário
          </label>
          <input
            type="time"
            value={flight.time}
            onChange={(e) => onChange({ ...flight, time: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            <MapPin className="inline-block w-3 h-3 mr-1" />
            Origem
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={flight.origin}
              onChange={(e) => onChange({ ...flight, origin: e.target.value })}
              placeholder="São Paulo"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
            <input
              type="text"
              value={flight.originCode}
              onChange={(e) => onChange({ ...flight, originCode: e.target.value.toUpperCase() })}
              placeholder="GRU"
              maxLength={3}
              className="w-16 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm text-center font-mono uppercase"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            <MapPin className="inline-block w-3 h-3 mr-1" />
            Destino
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={flight.destination}
              onChange={(e) => onChange({ ...flight, destination: e.target.value })}
              placeholder="Miami"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
            <input
              type="text"
              value={flight.destinationCode}
              onChange={(e) => onChange({ ...flight, destinationCode: e.target.value.toUpperCase() })}
              placeholder="MIA"
              maxLength={3}
              className="w-16 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm text-center font-mono uppercase"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Duração do Voo</label>
          <input
            type="text"
            value={flight.duration}
            onChange={(e) => onChange({ ...flight, duration: e.target.value })}
            placeholder="ex: 10h 30min"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Paradas</label>
          <select
            value={flight.stops}
            onChange={(e) => onChange({ ...flight, stops: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-white"
          >
            <option value="Direto">✈️ Voo Direto</option>
            <option value="1 parada">1 Parada</option>
            <option value="2 paradas">2 Paradas</option>
            <option value="2+ paradas">2+ Paradas</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const FlightsSection: React.FC<FlightsSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <FlightForm
        title="Voo de Ida"
        icon={<Plane className="w-5 h-5 text-primary" />}
        flight={data.outbound}
        onChange={(outbound) => onChange({ ...data, outbound })}
      />
      
      <FlightForm
        title="Voo de Volta"
        icon={<Plane className="w-5 h-5 text-primary transform rotate-180" />}
        flight={data.return}
        onChange={(returnFlight) => onChange({ ...data, return: returnFlight })}
      />
    </div>
  );
};

export default FlightsSection;
