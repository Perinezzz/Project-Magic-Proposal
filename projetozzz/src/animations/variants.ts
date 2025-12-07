import { Variants } from 'framer-motion';

/**
 * Variantes de animação reutilizáveis para melhor UX
 */

// Fade in/out básico
export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide in from top
export const slideInFromTop: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Slide in from bottom
export const slideInFromBottom: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

// Slide in from left
export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};

// Slide in from right
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

// Scale in
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

// Scale in with bounce
export const scaleInBounce: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: { opacity: 0, scale: 0.8 },
};

// Accordion expand/collapse
export const expandCollapse: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3 },
    },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Stagger item
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Hover lift effect
export const hoverLift: Variants = {
  rest: { y: 0 },
  hover: { y: -4 },
};

// Pulse animation for important elements
export const pulse: Variants = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Shake for errors
export const shake: Variants = {
  animate: {
    x: [-8, 8, -8, 8, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

// Bounce for success
export const bounce: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

// Flip horizontal
export const flipHorizontal: Variants = {
  initial: { rotateY: -90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: 90, opacity: 0 },
  transition: { duration: 0.4 },
};

// Rotate in
export const rotateIn: Variants = {
  initial: { opacity: 0, rotate: -20 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 20 },
  transition: { duration: 0.3 },
};

// Modal background
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal content
export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring' } },
  exit: { opacity: 0, scale: 0.9 },
};
