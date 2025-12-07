import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { TravelProposal } from "../../types";
import { ImageUpload } from "../ui/ImageUpload";
import { LocationAutocomplete } from "../ui/LocationAutocomplete";

interface DestinationSectionProps {
  data: TravelProposal["destination"];
  onChange: (data: TravelProposal["destination"]) => void;
}

export const DestinationSection: React.FC<DestinationSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Destination Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Nome do Destino *
        </label>
        <LocationAutocomplete
          value={data.name}
          onChange={(name, code) => onChange({ ...data, name, code })}
          placeholder="ex: Maldivas, Paris, Fernando de Noronha..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
          type="all"
        />
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Check-in
          </label>
          <input
            type="date"
            value={data.checkIn}
            onChange={(e) => onChange({ ...data, checkIn: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Check-out
          </label>
          <input
            type="date"
            value={data.checkOut}
            onChange={(e) => onChange({ ...data, checkOut: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Duration display */}
      {data.checkIn && data.checkOut && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
          <span>📅</span>
          <span>
            Duração:{" "}
            {Math.ceil(
              (new Date(data.checkOut).getTime() -
                new Date(data.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            noites
          </span>
        </div>
      )}

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📸 Imagem Principal do Destino
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Escolha uma foto impressionante que será o destaque da proposta
        </p>
        <ImageUpload
          value={data.heroImage || ""}
          onChange={(heroImage) => onChange({ ...data, heroImage })}
          aspectRatio="wide"
          placeholder="Arraste uma foto de alta qualidade do destino"
        />
      </div>
    </div>
  );
};

export default DestinationSection;
