import { useCallback, useRef, useState } from 'react';

/**
 * Hook para gerenciar histórico de edições (Undo/Redo)
 */
export function useFormHistory<T>(initialValue: T, maxHistory: number = 50) {
  const [state, setState] = useState<T>(initialValue);
  const historyRef = useRef<T[]>([initialValue]);
  const currentIndexRef = useRef<number>(0);

  const pushToHistory = useCallback((newState: T) => {
    // Remove qualquer histórico futuro se estamos no meio do undo
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    
    // Adiciona novo estado
    historyRef.current.push(newState);
    
    // Limita o tamanho do histórico
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    } else {
      currentIndexRef.current++;
    }
    
    setState(newState);
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      setState(historyRef.current[currentIndexRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      setState(historyRef.current[currentIndexRef.current]);
    }
  }, []);

  const canUndo = currentIndexRef.current > 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  return {
    state,
    setState: pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: useCallback(() => {
      historyRef.current = [initialValue];
      currentIndexRef.current = 0;
      setState(initialValue);
    }, [initialValue]),
  };
}

/**
 * Hook para salvamento automático com debounce
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void,
  delay: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const save = useCallback((dataToSave: T) => {
    setIsSaving(true);
    
    try {
      onSave(dataToSave);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Usar useEffect para monitorar mudanças
  const handleAutoSave = useCallback(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar novo timeout
    timeoutRef.current = setTimeout(() => {
      save(data);
    }, delay);
  }, [data, delay, save]);

  return {
    save,
    handleAutoSave,
    isSaving,
    lastSaved,
  };
}
