import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Globe, Plane, Hotel, 
  Package, Compass, DollarSign, User, Sparkles 
} from 'lucide-react';
import { TravelProposal, createEmptyProposal } from '../types';
import { saveProposal, generateShareableLink, applyTheme } from '../services/storage';
import { generateDestinationDescription } from '../services/aiService';
import { Accordion } from '../components/ui/Accordion';
import { SuccessModal } from '../components/ui/SuccessModal';

import { AgencySection } from '../components/form/AgencySection';
import { DestinationSection } from '../components/form/DestinationSection';
import { AboutSection } from '../components/form/AboutSection';
import { FlightsSection } from '../components/form/FlightsSection';
import { AccommodationSection } from '../components/form/AccommodationSection';
import { InclusionsSection } from '../components/form/InclusionsSection';
import { ExperiencesSection } from '../components/form/ExperiencesSection';
import { InvestmentSection } from '../components/form/InvestmentSection';
import { ConsultantSection } from '../components/form/ConsultantSection';

const SECTIONS = [
  { id: 'agency', title: 'Identidade da Agência', icon: <Building2 size={20} /> },
  { id: 'destination', title: 'Destino', icon: <MapPin size={20} /> },
  { id: 'about', title: 'Sobre o Destino', icon: <Globe size={20} /> },
  { id: 'flights', title: 'Voos', icon: <Plane size={20} /> },
  { id: 'accommodation', title: 'Hospedagem', icon: <Hotel size={20} /> },
  { id: 'inclusions', title: 'Incluído no Pacote', icon: <Package size={20} /> },
  { id: 'experiences', title: 'Experiências', icon: <Compass size={20} /> },
  { id: 'investment', title: 'Investimento', icon: <DollarSign size={20} /> },
  { id: 'consultant', title: 'Consultor', icon: <User size={20} /> },
];

export const FormPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<TravelProposal, 'id' | 'createdAt'>>(createEmptyProposal());
  const [activeSection, setActiveSection] = useState('agency');
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedProposal, setSavedProposal] = useState<TravelProposal | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const previousDestination = useRef<string>('');

  // Detecta mudança de destino e gera descrição com IA
  useEffect(() => {
    const currentDestination = formData.destination.name;
    
    // Só gera se o destino mudou, tem pelo menos 3 caracteres, e a descrição está vazia
    if (
      currentDestination !== previousDestination.current && 
      currentDestination.length >= 3 &&
      !formData.about.description
    ) {
      previousDestination.current = currentDestination;
      
      // Debounce de 1 segundo para evitar chamadas excessivas
      const timeoutId = setTimeout(async () => {
        setIsGeneratingDescription(true);
        try {
          const description = await generateDestinationDescription(currentDestination);
          setFormData(prev => ({
            ...prev,
            about: { ...prev.about, description }
          }));
        } catch (error) {
          console.error('Erro ao gerar descrição:', error);
        } finally {
          setIsGeneratingDescription(false);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData.destination.name, formData.about.description]);

  // Apply initial theme
  useEffect(() => {
    applyTheme(formData.agency.theme);
  }, []);

  const handleSubmit = () => {
    const proposal = saveProposal(formData);
    setSavedProposal(proposal);
    setShowSuccess(true);
  };

  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'agency':
        return !!formData.agency.name;
      case 'destination':
        return !!formData.destination.name && !!formData.destination.checkIn;
      case 'about':
        return formData.about.description.length >= 50;
      case 'flights':
        return !!formData.flights.outbound.origin;
      case 'accommodation':
        return !!formData.accommodation.name;
      case 'inclusions':
        return Object.values(formData.inclusions).some(v => v === true);
      case 'experiences':
        return !formData.experiencesEnabled || formData.experiences.length > 0;
      case 'investment':
        return formData.investment.price > 0;
      case 'consultant':
        return !!formData.consultant.name && !!formData.consultant.phone;
      default:
        return false;
    }
  };

  const sectionsWithStatus = SECTIONS.map(section => ({
    ...section,
    isComplete: isSectionComplete(section.id),
  }));

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
          >
            <Sparkles size={16} />
            Gerador de Propostas de Viagem
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Crie uma proposta <span className="gradient-text">mágica</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Preencha os detalhes abaixo e encante seu cliente com uma proposta visual profissional
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progresso</span>
            <span className="text-sm font-medium text-primary">
              {sectionsWithStatus.filter(s => s.isComplete).length}/{SECTIONS.length} completo
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(sectionsWithStatus.filter(s => s.isComplete).length / SECTIONS.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        </motion.div>

        {/* Form Accordion */}
        <Accordion
          sections={sectionsWithStatus}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        >
          <AgencySection
            data={formData.agency}
            onChange={(agency) => setFormData({ ...formData, agency })}
          />
          <DestinationSection
            data={formData.destination}
            onChange={(destination) => setFormData({ ...formData, destination })}
          />
          <AboutSection
            data={formData.about}
            onChange={(about) => setFormData({ ...formData, about })}
            isLoadingAI={isGeneratingDescription}
          />
          <FlightsSection
            data={formData.flights}
            onChange={(flights) => setFormData({ ...formData, flights })}
          />
          <AccommodationSection
            data={formData.accommodation}
            onChange={(accommodation) => setFormData({ ...formData, accommodation })}
          />
          <InclusionsSection
            data={formData.inclusions}
            onChange={(inclusions) => setFormData({ ...formData, inclusions })}
          />
          <ExperiencesSection
            enabled={formData.experiencesEnabled}
            data={formData.experiences}
            onToggle={(experiencesEnabled) => setFormData({ ...formData, experiencesEnabled })}
            onChange={(experiences) => setFormData({ ...formData, experiences })}
          />
          <InvestmentSection
            data={formData.investment}
            onChange={(investment) => setFormData({ ...formData, investment })}
          />
          <ConsultantSection
            data={formData.consultant}
            onChange={(consultant) => setFormData({ ...formData, consultant })}
          />
        </Accordion>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-5 rounded-2xl btn-gradient text-white text-xl font-bold shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
          >
            <Sparkles size={24} />
            Gerar Proposta Mágica
          </motion.button>
        </motion.div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          proposalId={savedProposal?.id || ''}
          shareableLink={savedProposal ? generateShareableLink(savedProposal.id) : ''}
        />
      </div>
    </div>
  );
};

export default FormPage;
