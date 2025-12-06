// ================================
// STORAGE SERVICE
// ================================

import { TravelProposal } from '../types';

const STORAGE_KEY = 'travel_proposals';

// Generate unique ID
export const generateId = (): string => {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all proposals
export const getAllProposals = (): TravelProposal[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// Save a new proposal
export const saveProposal = (proposal: Omit<TravelProposal, 'id' | 'createdAt'>): TravelProposal => {
    const proposals = getAllProposals();

    const newProposal: TravelProposal = {
        ...proposal,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };

    proposals.push(newProposal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));

    return newProposal;
};

// Get proposal by ID
export const getProposal = (id: string): TravelProposal | null => {
    const proposals = getAllProposals();
    return proposals.find(p => p.id === id) || null;
};

// Update proposal
export const updateProposal = (id: string, updates: Partial<TravelProposal>): TravelProposal | null => {
    const proposals = getAllProposals();
    const index = proposals.findIndex(p => p.id === id);

    if (index === -1) return null;

    proposals[index] = { ...proposals[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));

    return proposals[index];
};

// Delete proposal
export const deleteProposal = (id: string): boolean => {
    const proposals = getAllProposals();
    const filtered = proposals.filter(p => p.id !== id);

    if (filtered.length === proposals.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

// Generate shareable link
export const generateShareableLink = (id: string): string => {
    return `${window.location.origin}/proposta/${id}`;
};

// Format currency
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// Parse currency input
export const parseCurrencyInput = (value: string): number => {
    const cleaned = value.replace(/\D/g, '');
    return parseInt(cleaned, 10) / 100 || 0;
};

// Format date
export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

// Calculate trip duration
export const calculateDuration = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// Apply theme colors
export const applyTheme = (theme: { primary: string; primaryLight: string; accent: string; accentLight: string }) => {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-primary-light', theme.primaryLight);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-accent-light', theme.accentLight);
};
