import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Cloud, CloudOff } from 'lucide-react';

interface AutoSaveFeedbackProps {
  isSaving: boolean;
  lastSaved?: Date;
  hasError?: boolean;
  errorMessage?: string;
}

export const AutoSaveFeedback: React.FC<AutoSaveFeedbackProps> = ({
  isSaving,
  lastSaved,
  hasError = false,
  errorMessage,
}) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'Agora';
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return 'Há um dia';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg shadow-lg"
          >
            <CloudOff size={18} />
            <span className="text-sm font-medium">{errorMessage || 'Erro ao salvar'}</span>
          </motion.div>
        ) : isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-2 px-4 py-3 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 rounded-lg shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Cloud size={18} />
            </motion.div>
            <span className="text-sm font-medium">Salvando...</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200 rounded-lg shadow-lg"
          >
            <Check size={18} />
            <span className="text-sm font-medium">Salvo {getTimeAgo(lastSaved)}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

interface FormActionBarProps {
  onSave?: () => void;
  onCancel?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
  isDirty?: boolean;
}

export const FormActionBar: React.FC<FormActionBarProps> = ({
  onSave,
  onCancel,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  isDirty = false,
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-40"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↶
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↷
          </button>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isDirty ? '● Alterações não salvas' : '○ Tudo salvo'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          )}
          {onSave && (
            <motion.button
              onClick={onSave}
              disabled={isSaving || !isDirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSaving ? 'Salvando...' : 'Salvar Proposta'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
