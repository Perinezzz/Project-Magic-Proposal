import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Copy, ExternalLink, MessageCircle, Check, Sparkles } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposalId: string;
    shareableLink: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    proposalId,
    shareableLink,
}) => {
    const [copied, setCopied] = React.useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareableLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`✈️ Confira a proposta especial de viagem que preparei para você!\n\n${shareableLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleView = () => {
        window.location.href = `/proposta/${proposalId}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-primary to-accent p-8 pb-12 text-white text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
                            >
                                <Sparkles size={40} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold mb-2"
                            >
                                Proposta Criada com Sucesso! 🎉
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/80"
                            >
                                Sua proposta mágica está pronta para encantar!
                            </motion.p>
                        </div>

                        {/* Content */}
                        <div className="p-6 -mt-6">
                            {/* Link Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gray-50 rounded-2xl p-4 mb-6"
                            >
                                <label className="text-xs font-medium text-gray-500 mb-2 block">
                                    LINK DA PROPOSTA
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={shareableLink}
                                        readOnly
                                        className="flex-1 bg-white rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCopy}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-primary text-white hover:bg-primary/90'
                                            }`}
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleWhatsApp}
                                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-medium transition-colors"
                                >
                                    <MessageCircle size={20} />
                                    WhatsApp
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleView}
                                    className="flex items-center justify-center gap-2 btn-gradient text-white py-4 rounded-xl font-medium"
                                >
                                    <ExternalLink size={20} />
                                    Visualizar
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
