import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plane, Building2 } from "lucide-react";

// Database de localizações populares (cidades, destinos turísticos e aeroportos)
const LOCATIONS_DATABASE = [
  // Brasil
  { name: "São Paulo", code: "GRU", country: "Brasil", type: "city" },
  { name: "Rio de Janeiro", code: "GIG", country: "Brasil", type: "city" },
  {
    name: "Fernando de Noronha",
    code: "FEN",
    country: "Brasil",
    type: "destination",
  },
  { name: "Florianópolis", code: "FLN", country: "Brasil", type: "city" },
  { name: "Salvador", code: "SSA", country: "Brasil", type: "city" },
  { name: "Recife", code: "REC", country: "Brasil", type: "city" },
  { name: "Fortaleza", code: "FOR", country: "Brasil", type: "city" },
  { name: "Brasília", code: "BSB", country: "Brasil", type: "city" },
  { name: "Belo Horizonte", code: "CNF", country: "Brasil", type: "city" },
  { name: "Porto Alegre", code: "POA", country: "Brasil", type: "city" },
  { name: "Manaus", code: "MAO", country: "Brasil", type: "city" },
  { name: "Curitiba", code: "CWB", country: "Brasil", type: "city" },
  { name: "Natal", code: "NAT", country: "Brasil", type: "city" },
  { name: "Maceió", code: "MCZ", country: "Brasil", type: "city" },
  {
    name: "Foz do Iguaçu",
    code: "IGU",
    country: "Brasil",
    type: "destination",
  },
  { name: "Gramado", code: "CXJ", country: "Brasil", type: "destination" },
  { name: "Búzios", code: "", country: "Brasil", type: "destination" },
  { name: "Paraty", code: "", country: "Brasil", type: "destination" },
  { name: "Jericoacoara", code: "", country: "Brasil", type: "destination" },
  {
    name: "Chapada Diamantina",
    code: "",
    country: "Brasil",
    type: "destination",
  },
  {
    name: "Lençóis Maranhenses",
    code: "",
    country: "Brasil",
    type: "destination",
  },
  { name: "Bonito", code: "", country: "Brasil", type: "destination" },
  { name: "Pantanal", code: "CGR", country: "Brasil", type: "destination" },

  // América do Norte
  { name: "Nova York", code: "JFK", country: "Estados Unidos", type: "city" },
  { name: "Los Angeles", code: "LAX", country: "Estados Unidos", type: "city" },
  { name: "Miami", code: "MIA", country: "Estados Unidos", type: "city" },
  { name: "Orlando", code: "MCO", country: "Estados Unidos", type: "city" },
  { name: "Las Vegas", code: "LAS", country: "Estados Unidos", type: "city" },
  {
    name: "San Francisco",
    code: "SFO",
    country: "Estados Unidos",
    type: "city",
  },
  { name: "Chicago", code: "ORD", country: "Estados Unidos", type: "city" },
  {
    name: "Washington D.C.",
    code: "IAD",
    country: "Estados Unidos",
    type: "city",
  },
  { name: "Boston", code: "BOS", country: "Estados Unidos", type: "city" },
  {
    name: "Havaí",
    code: "HNL",
    country: "Estados Unidos",
    type: "destination",
  },
  { name: "Toronto", code: "YYZ", country: "Canadá", type: "city" },
  { name: "Vancouver", code: "YVR", country: "Canadá", type: "city" },
  { name: "Montreal", code: "YUL", country: "Canadá", type: "city" },
  { name: "Cidade do México", code: "MEX", country: "México", type: "city" },
  { name: "Cancún", code: "CUN", country: "México", type: "destination" },
  {
    name: "Playa del Carmen",
    code: "CUN",
    country: "México",
    type: "destination",
  },

  // América do Sul
  { name: "Buenos Aires", code: "EZE", country: "Argentina", type: "city" },
  { name: "Bariloche", code: "BRC", country: "Argentina", type: "destination" },
  { name: "Mendoza", code: "MDZ", country: "Argentina", type: "city" },
  { name: "Santiago", code: "SCL", country: "Chile", type: "city" },
  { name: "Cartagena", code: "CTG", country: "Colômbia", type: "city" },
  { name: "Bogotá", code: "BOG", country: "Colômbia", type: "city" },
  { name: "Lima", code: "LIM", country: "Peru", type: "city" },
  { name: "Cusco", code: "CUZ", country: "Peru", type: "city" },
  { name: "Machu Picchu", code: "CUZ", country: "Peru", type: "destination" },
  { name: "Montevidéu", code: "MVD", country: "Uruguai", type: "city" },
  {
    name: "Punta del Este",
    code: "PDP",
    country: "Uruguai",
    type: "destination",
  },

  // Europa
  { name: "Paris", code: "CDG", country: "França", type: "city" },
  { name: "Nice", code: "NCE", country: "França", type: "city" },
  { name: "Londres", code: "LHR", country: "Reino Unido", type: "city" },
  { name: "Roma", code: "FCO", country: "Itália", type: "city" },
  { name: "Milão", code: "MXP", country: "Itália", type: "city" },
  { name: "Veneza", code: "VCE", country: "Itália", type: "city" },
  { name: "Florença", code: "FLR", country: "Itália", type: "city" },
  {
    name: "Costa Amalfitana",
    code: "NAP",
    country: "Itália",
    type: "destination",
  },
  { name: "Madri", code: "MAD", country: "Espanha", type: "city" },
  { name: "Barcelona", code: "BCN", country: "Espanha", type: "city" },
  { name: "Ibiza", code: "IBZ", country: "Espanha", type: "destination" },
  { name: "Maiorca", code: "PMI", country: "Espanha", type: "destination" },
  { name: "Lisboa", code: "LIS", country: "Portugal", type: "city" },
  { name: "Porto", code: "OPO", country: "Portugal", type: "city" },
  { name: "Algarve", code: "FAO", country: "Portugal", type: "destination" },
  { name: "Amsterdã", code: "AMS", country: "Holanda", type: "city" },
  { name: "Berlim", code: "BER", country: "Alemanha", type: "city" },
  { name: "Munique", code: "MUC", country: "Alemanha", type: "city" },
  { name: "Viena", code: "VIE", country: "Áustria", type: "city" },
  { name: "Praga", code: "PRG", country: "República Tcheca", type: "city" },
  { name: "Budapeste", code: "BUD", country: "Hungria", type: "city" },
  { name: "Atenas", code: "ATH", country: "Grécia", type: "city" },
  { name: "Santorini", code: "JTR", country: "Grécia", type: "destination" },
  { name: "Mykonos", code: "JMK", country: "Grécia", type: "destination" },
  { name: "Dubrovnik", code: "DBV", country: "Croácia", type: "city" },
  { name: "Zurique", code: "ZRH", country: "Suíça", type: "city" },
  { name: "Genebra", code: "GVA", country: "Suíça", type: "city" },
  { name: "Alpes Suíços", code: "ZRH", country: "Suíça", type: "destination" },
  { name: "Dublin", code: "DUB", country: "Irlanda", type: "city" },
  { name: "Edimburgo", code: "EDI", country: "Escócia", type: "city" },
  { name: "Copenhague", code: "CPH", country: "Dinamarca", type: "city" },
  { name: "Estocolmo", code: "ARN", country: "Suécia", type: "city" },
  { name: "Oslo", code: "OSL", country: "Noruega", type: "city" },
  { name: "Reykjavik", code: "KEF", country: "Islândia", type: "city" },
  { name: "Moscou", code: "SVO", country: "Rússia", type: "city" },
  { name: "São Petersburgo", code: "LED", country: "Rússia", type: "city" },

  // Ásia
  { name: "Tóquio", code: "NRT", country: "Japão", type: "city" },
  { name: "Kyoto", code: "KIX", country: "Japão", type: "city" },
  { name: "Hong Kong", code: "HKG", country: "China", type: "city" },
  { name: "Xangai", code: "PVG", country: "China", type: "city" },
  { name: "Pequim", code: "PEK", country: "China", type: "city" },
  { name: "Singapura", code: "SIN", country: "Singapura", type: "city" },
  { name: "Bangkok", code: "BKK", country: "Tailândia", type: "city" },
  { name: "Phuket", code: "HKT", country: "Tailândia", type: "destination" },
  { name: "Bali", code: "DPS", country: "Indonésia", type: "destination" },
  { name: "Seul", code: "ICN", country: "Coreia do Sul", type: "city" },
  { name: "Dubai", code: "DXB", country: "Emirados Árabes", type: "city" },
  { name: "Abu Dhabi", code: "AUH", country: "Emirados Árabes", type: "city" },
  { name: "Tel Aviv", code: "TLV", country: "Israel", type: "city" },
  { name: "Mumbai", code: "BOM", country: "Índia", type: "city" },
  { name: "Nova Delhi", code: "DEL", country: "Índia", type: "city" },
  { name: "Marrakech", code: "RAK", country: "Marrocos", type: "city" },

  // Oceania
  { name: "Sydney", code: "SYD", country: "Austrália", type: "city" },
  { name: "Melbourne", code: "MEL", country: "Austrália", type: "city" },
  { name: "Auckland", code: "AKL", country: "Nova Zelândia", type: "city" },
  {
    name: "Queenstown",
    code: "ZQN",
    country: "Nova Zelândia",
    type: "destination",
  },
  { name: "Fiji", code: "NAN", country: "Fiji", type: "destination" },
  {
    name: "Bora Bora",
    code: "BOB",
    country: "Polinésia Francesa",
    type: "destination",
  },
  {
    name: "Tahiti",
    code: "PPT",
    country: "Polinésia Francesa",
    type: "destination",
  },

  // Ilhas e Destinos Exóticos
  { name: "Maldivas", code: "MLE", country: "Maldivas", type: "destination" },
  {
    name: "Ilhas Maurício",
    code: "MRU",
    country: "Maurício",
    type: "destination",
  },
  {
    name: "Seychelles",
    code: "SEZ",
    country: "Seychelles",
    type: "destination",
  },
  { name: "Aruba", code: "AUA", country: "Aruba", type: "destination" },
  { name: "Curaçao", code: "CUR", country: "Curaçao", type: "destination" },
  { name: "Barbados", code: "BGI", country: "Barbados", type: "destination" },
  {
    name: "Turks and Caicos",
    code: "PLS",
    country: "Turks and Caicos",
    type: "destination",
  },
  { name: "Bahamas", code: "NAS", country: "Bahamas", type: "destination" },
  { name: "Jamaica", code: "MBJ", country: "Jamaica", type: "destination" },
  {
    name: "Punta Cana",
    code: "PUJ",
    country: "República Dominicana",
    type: "destination",
  },
  {
    name: "St. Martin",
    code: "SXM",
    country: "St. Martin",
    type: "destination",
  },

  // África
  {
    name: "Cidade do Cabo",
    code: "CPT",
    country: "África do Sul",
    type: "city",
  },
  { name: "Joanesburgo", code: "JNB", country: "África do Sul", type: "city" },
  {
    name: "Safari Kruger",
    code: "MQP",
    country: "África do Sul",
    type: "destination",
  },
  { name: "Cairo", code: "CAI", country: "Egito", type: "city" },
  { name: "Zanzibar", code: "ZNZ", country: "Tanzânia", type: "destination" },
  { name: "Serengeti", code: "SEU", country: "Tanzânia", type: "destination" },
  { name: "Masai Mara", code: "NBO", country: "Quênia", type: "destination" },
];

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, code?: string) => void;
  onCodeChange?: (code: string) => void;
  placeholder?: string;
  className?: string;
  showCode?: boolean;
  type?: "all" | "city" | "destination" | "airport";
}

interface Location {
  name: string;
  code: string;
  country: string;
  type: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onCodeChange,
  placeholder = "Digite uma localização...",
  className = "",
  showCode = false,
  type = "all",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtra as localizações baseado no input
  const filterLocations = (query: string): Location[] => {
    if (!query || query.length < 2) return [];

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return LOCATIONS_DATABASE.filter((location) => {
      // Filtra por tipo se especificado
      if (type !== "all" && location.type !== type) return false;

      const normalizedName = location.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedCountry = location.country
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedCode = location.code.toLowerCase();

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedCountry.includes(normalizedQuery) ||
        normalizedCode.includes(normalizedQuery)
      );
    }).slice(0, 8); // Limita a 8 sugestões
  };

  // Atualiza sugestões quando o valor muda
  useEffect(() => {
    const newSuggestions = filterLocations(value);
    setSuggestions(newSuggestions);
    setHighlightedIndex(-1);

    if (newSuggestions.length > 0 && value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [value, type]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Seleciona uma localização
  const selectLocation = (location: Location) => {
    // Passa nome e código juntos para evitar problemas de closure
    onChange(location.name, location.code || undefined);
    // Também chama onCodeChange para compatibilidade
    if (onCodeChange && location.code) {
      onCodeChange(location.code);
    }
    setIsOpen(false);
  };

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectLocation(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Retorna o ícone baseado no tipo de localização
  const getIcon = (locationType: string) => {
    switch (locationType) {
      case "city":
        return <Building2 className="w-4 h-4 text-gray-400" />;
      case "destination":
        return <MapPin className="w-4 h-4 text-orange-400" />;
      default:
        return <Plane className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            {suggestions.map((location, index) => (
              <motion.button
                key={`${location.name}-${location.code}`}
                type="button"
                onClick={() => selectLocation(location)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  highlightedIndex === index
                    ? "bg-primary/10"
                    : "hover:bg-gray-50"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {getIcon(location.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {location.name}
                    {showCode && location.code && (
                      <span className="ml-2 text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {location.code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {location.country}
                  </div>
                </div>
                {location.type === "destination" && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Destino
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationAutocomplete;
