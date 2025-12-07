import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #fff9e6 0%, #ffe4a0 100%)",
        border: isDark
          ? "2px solid rgba(255, 255, 255, 0.2)"
          : "2px solid rgba(255, 193, 7, 0.4)",
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-yellow-300" />
        ) : (
          <Sun className="w-6 h-6 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
