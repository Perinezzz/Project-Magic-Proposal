import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface AccordionSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    isComplete?: boolean;
}

interface AccordionProps {
    sections: AccordionSection[];
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
    children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
    sections,
    activeSection,
    onSectionChange,
    children,
}) => {
    return (
        <div className="space-y-3">
            {React.Children.toArray(children).map((child, index) => {
                const section = sections[index];
                if (!section) return null;

                const isActive = activeSection === section.id;

                return (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-100"
                    >
                        {/* Header */}
                        <button
                            onClick={() => onSectionChange(section.id)}
                            className={`w-full flex items-center justify-between p-5 text-left transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-primary/5 to-accent/5'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ scale: isActive ? 1.1 : 1 }}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${section.isComplete
                                            ? 'bg-green-100 dark:bg-green-900 text-green-600'
                                            : isActive
                                                ? 'bg-gradient-to-br from-primary to-accent text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                                        }`}
                                >
                                    {section.isComplete ? (
                                        <Check size={20} className="text-green-700 dark:text-green-300" strokeWidth={3} />
                                    ) : isActive ? (
                                        <div className="text-white">{React.cloneElement(section.icon as React.ReactElement, { strokeWidth: 2.5 })}</div>
                                    ) : (
                                        <div className="text-gray-600 dark:text-gray-400">{React.cloneElement(section.icon as React.ReactElement, { strokeWidth: 2.5 })}</div>
                                    )}
                                </motion.div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        PASSO {index + 1} DE {sections.length}
                                    </span>
                                    <h3 className={`font-semibold text-lg ${isActive ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                        {section.title}
                                    </h3>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: isActive ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className={`${isActive ? 'text-primary' : 'text-gray-400'}`}
                            >
                                <ChevronDown size={24} />
                            </motion.div>
                        </button>

                        {/* Content */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="p-6 pt-2 border-t border-gray-100">
                                        {child}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default Accordion;
