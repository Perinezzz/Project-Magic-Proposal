import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, FileText, Loader, Check } from 'lucide-react';
import { TravelProposal } from '../../types';
import { downloadProposalPDF, shareViaWhatsApp, generateWhatsAppShareLink } from '../../services/pdfService';

interface ExportMenuProps {
  proposal: TravelProposal;
  onExportComplete?: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ proposal, onExportComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleDownloadPDF = async () => {
    setGenerationStep('generating');
    setIsGenerating(true);

    try {
      await downloadProposalPDF(proposal, {
        fileName: `proposta-${proposal.destination.name.toLowerCase().replace(/\s+/g, '-')}`,
        includeWatermark: true,
        quality: 'high',
      });

      setGenerationStep('completed');
      setTimeout(() => {
        setGenerationStep('idle');
        onExportComplete?.();
      }, 2000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setGenerationStep('idle');
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = () => {
    try {
      shareViaWhatsApp(proposal, recipientPhone || undefined);
      setShowPhoneInput(false);
      setRecipientPhone('');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao compartilhar no WhatsApp.');
    }
  };

  const handleCopyShareLink = () => {
    const link = generateWhatsAppShareLink(proposal);
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  };

  const menuVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
    transition: { duration: 0.2 },
  };

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="relative">
      {/* Botão Principal */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
      >
        <FileText size={20} />
        Exportar & Compartilhar
      </motion.button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-40 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Opção: Download PDF */}
                <motion.button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  whileHover={{ backgroundColor: 'rgba(0, 82, 204, 0.1)' }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isGenerating
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                    {generationStep === 'generating' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Loader size={20} className="text-primary" />
                      </motion.div>
                    ) : generationStep === 'completed' ? (
                      <Check size={20} className="text-green-600" />
                    ) : (
                      <Download size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {generationStep === 'generating'
                        ? 'Gerando PDF...'
                        : generationStep === 'completed'
                          ? 'PDF Gerado! ✓'
                          : 'Download em PDF'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {generationStep === 'generating'
                        ? 'Isso pode levar alguns segundos'
                        : 'Proposta em alta qualidade'}
                    </div>
                  </div>
                </motion.button>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {/* Opção: Compartilhar WhatsApp */}
                <motion.button
                  onClick={() => setShowPhoneInput(!showPhoneInput)}
                  whileHover={{ backgroundColor: 'rgba(37, 211, 102, 0.1)' }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                    <Share2 size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Compartilhar no WhatsApp
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Envie para um cliente
                    </div>
                  </div>
                </motion.button>

                {/* Input de Telefone */}
                <AnimatePresence>
                  {showPhoneInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-14 space-y-2"
                    >
                      <input
                        type="tel"
                        placeholder="+55 11 99999-9999"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleShareWhatsApp}
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Enviar
                        </button>
                        <button
                          onClick={() => {
                            setShowPhoneInput(false);
                            setRecipientPhone('');
                          }}
                          className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                      <button
                        onClick={() => handleShareWhatsApp()}
                        className="w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-colors"
                      >
                        Ou compartilhar sem número
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {/* Info Box */}
                <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-xs text-blue-900 dark:text-blue-200">
                    💡 <strong>Dica:</strong> O PDF contém o design profissional completo com imagens, clima, 
                    experiências e informações de preço.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Botão flutuante de exportação (para usar na página de visualização)
 */
interface FloatingExportButtonProps {
  proposal: TravelProposal;
}

export const FloatingExportButton: React.FC<FloatingExportButtonProps> = ({ proposal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 mb-4"
          >
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={() => downloadProposalPDF(proposal)}
                whileHover={{ scale: 1.1 }}
                className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                title="Download PDF"
              >
                <Download size={24} />
                <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Download PDF
                </span>
              </motion.button>

              <motion.button
                onClick={() => shareViaWhatsApp(proposal)}
                whileHover={{ scale: 1.1 }}
                className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                title="Compartilhar WhatsApp"
              >
                <Share2 size={24} />
                <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Compartilhar
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-2xl hover:shadow-2xl transition-all"
      >
        <FileText size={28} />
      </motion.button>
    </motion.div>
  );
};
