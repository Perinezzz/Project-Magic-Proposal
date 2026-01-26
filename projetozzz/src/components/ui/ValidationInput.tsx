import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ValidationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

export const ValidationInput: React.FC<ValidationInputProps> = ({
  label,
  error,
  success,
  helperText,
  icon,
  className = '',
  ...inputProps
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {inputProps.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon && (
            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          )}
        </div>

        <input
          {...inputProps}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} py-3 rounded-xl border-2 transition-all duration-200
            ${
              hasError
                ? 'border-red-400 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : success
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/20 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
            ${className}
          `}
        />

        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
            </motion.div>
          )}
          {success && !hasError && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ValidationTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  maxLength?: number;
}

export const ValidationTextarea: React.FC<ValidationTextareaProps> = ({
  label,
  error,
  success,
  helperText,
  maxLength,
  className = '',
  value = '',
  ...textareaProps
}) => {
  const hasError = !!error;
  const charCount = String(value).length;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {textareaProps.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        {maxLength && (
          <span
            className={`text-xs ${
              charCount > maxLength * 0.9
                ? 'text-red-500'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        {...textareaProps}
        value={value}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
          ${
            hasError
              ? 'border-red-400 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : success
                ? 'border-green-400 bg-green-50 dark:bg-green-950/20 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          ${className}
        `}
      />

      <AnimatePresence>
        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm ${
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
