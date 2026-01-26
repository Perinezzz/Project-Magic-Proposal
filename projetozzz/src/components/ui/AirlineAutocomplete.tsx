import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Search } from "lucide-react";

// Banco de dados de companhias aéreas populares
const AIRLINES_DATABASE = [
  // Brasileiras
  { name: "LATAM Airlines", code: "LA", country: "Brasil" },
  { name: "GOL Linhas Aéreas", code: "G3", country: "Brasil" },
  { name: "Azul Linhas Aéreas", code: "AD", country: "Brasil" },
  { name: "Voepass (Passaredo)", code: "2Z", country: "Brasil" },

  // Americanas
  { name: "American Airlines", code: "AA", country: "EUA" },
  { name: "United Airlines", code: "UA", country: "EUA" },
  { name: "Delta Air Lines", code: "DL", country: "EUA" },
  { name: "Southwest Airlines", code: "WN", country: "EUA" },
  { name: "JetBlue Airways", code: "B6", country: "EUA" },
  { name: "Alaska Airlines", code: "AS", country: "EUA" },
  { name: "Spirit Airlines", code: "NK", country: "EUA" },
  { name: "Frontier Airlines", code: "F9", country: "EUA" },
  { name: "Air Canada", code: "AC", country: "Canadá" },
  { name: "Aeromexico", code: "AM", country: "México" },
  { name: "Copa Airlines", code: "CM", country: "Panamá" },
  { name: "Avianca", code: "AV", country: "Colômbia" },

  // Europeias
  { name: "Air France", code: "AF", country: "França" },
  { name: "British Airways", code: "BA", country: "Reino Unido" },
  { name: "Lufthansa", code: "LH", country: "Alemanha" },
  { name: "KLM Royal Dutch", code: "KL", country: "Holanda" },
  { name: "Iberia", code: "IB", country: "Espanha" },
  { name: "TAP Air Portugal", code: "TP", country: "Portugal" },
  { name: "Swiss International", code: "LX", country: "Suíça" },
  { name: "Austrian Airlines", code: "OS", country: "Áustria" },
  { name: "Alitalia (ITA Airways)", code: "AZ", country: "Itália" },
  { name: "Turkish Airlines", code: "TK", country: "Turquia" },
  { name: "Norwegian Air", code: "DY", country: "Noruega" },
  { name: "Ryanair", code: "FR", country: "Irlanda" },
  { name: "EasyJet", code: "U2", country: "Reino Unido" },
  { name: "Vueling", code: "VY", country: "Espanha" },
  { name: "Aer Lingus", code: "EI", country: "Irlanda" },
  { name: "SAS Scandinavian", code: "SK", country: "Suécia" },
  { name: "Finnair", code: "AY", country: "Finlândia" },
  { name: "LOT Polish Airlines", code: "LO", country: "Polônia" },

  // Oriente Médio
  { name: "Emirates", code: "EK", country: "Emirados Árabes" },
  { name: "Qatar Airways", code: "QR", country: "Catar" },
  { name: "Etihad Airways", code: "EY", country: "Emirados Árabes" },
  { name: "Royal Jordanian", code: "RJ", country: "Jordânia" },
  { name: "Saudia", code: "SV", country: "Arábia Saudita" },

  // Asiáticas
  { name: "Singapore Airlines", code: "SQ", country: "Singapura" },
  { name: "Cathay Pacific", code: "CX", country: "Hong Kong" },
  { name: "Japan Airlines (JAL)", code: "JL", country: "Japão" },
  { name: "All Nippon Airways (ANA)", code: "NH", country: "Japão" },
  { name: "Korean Air", code: "KE", country: "Coreia do Sul" },
  { name: "Asiana Airlines", code: "OZ", country: "Coreia do Sul" },
  { name: "Thai Airways", code: "TG", country: "Tailândia" },
  { name: "Malaysia Airlines", code: "MH", country: "Malásia" },
  { name: "AirAsia", code: "AK", country: "Malásia" },
  { name: "Vietnam Airlines", code: "VN", country: "Vietnã" },
  { name: "China Airlines", code: "CI", country: "Taiwan" },
  { name: "EVA Air", code: "BR", country: "Taiwan" },
  { name: "Air China", code: "CA", country: "China" },
  { name: "China Eastern", code: "MU", country: "China" },
  { name: "China Southern", code: "CZ", country: "China" },
  { name: "Garuda Indonesia", code: "GA", country: "Indonésia" },
  { name: "Philippine Airlines", code: "PR", country: "Filipinas" },
  { name: "Air India", code: "AI", country: "Índia" },

  // Oceania
  { name: "Qantas", code: "QF", country: "Austrália" },
  { name: "Air New Zealand", code: "NZ", country: "Nova Zelândia" },
  { name: "Fiji Airways", code: "FJ", country: "Fiji" },

  // Africanas
  { name: "South African Airways", code: "SA", country: "África do Sul" },
  { name: "Ethiopian Airlines", code: "ET", country: "Etiópia" },
  { name: "EgyptAir", code: "MS", country: "Egito" },
  { name: "Royal Air Maroc", code: "AT", country: "Marrocos" },
  { name: "Kenya Airways", code: "KQ", country: "Quênia" },
];

interface AirlineAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AirlineAutocomplete: React.FC<AirlineAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "ex: LATAM, GOL, Azul",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter airlines based on input
  const filteredAirlines =
    inputValue.length > 0
      ? AIRLINES_DATABASE.filter(
          (airline) =>
            airline.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            airline.code.toLowerCase().includes(inputValue.toLowerCase()) ||
            airline.country.toLowerCase().includes(inputValue.toLowerCase())
        ).slice(0, 8)
      : [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(newValue.length > 0 && filteredAirlines.length > 0);
    setSelectedIndex(-1);
  };

  const handleSelect = (airline: (typeof AIRLINES_DATABASE)[0]) => {
    setInputValue(airline.name);
    onChange(airline.name);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredAirlines.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredAirlines.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredAirlines.length) {
          handleSelect(filteredAirlines[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Update filtered airlines check when input changes
  useEffect(() => {
    if (inputValue.length > 0 && filteredAirlines.length > 0) {
      setIsOpen(true);
    }
  }, [inputValue, filteredAirlines.length]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            inputValue.length > 0 &&
            filteredAirlines.length > 0 &&
            setIsOpen(true)
          }
          placeholder={placeholder}
          className={className}
        />
        {inputValue.length > 0 && (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredAirlines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-y-auto"
          >
            {filteredAirlines.map((airline, index) => (
              <motion.button
                key={airline.code}
                type="button"
                onClick={() => handleSelect(airline)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left ${
                  index === selectedIndex ? "bg-primary/10" : ""
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {airline.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {airline.code} • {airline.country}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirlineAutocomplete;
