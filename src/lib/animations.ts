// Optimized animation presets for Framer Motion
// Using GPU-accelerated properties (transform, opacity) for smooth 60fps animations

// Custom easing functions for different animation types
export const easings = {
  // Smooth ease out - best for enter animations
  easeOut: [0.16, 1, 0.3, 1] as const,
  // Quick ease in-out - best for hover/interactions
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // Smooth deceleration - best for closing/collapsing
  decelerate: [0, 0, 0.2, 1] as const,
  // Smooth acceleration - best for opening/expanding
  accelerate: [0.4, 0, 1, 1] as const,
  // Spring-like - for playful interactions
  spring: [0.34, 1.56, 0.64, 1] as const,
  // Linear for continuous animations
  linear: [0, 0, 1, 1] as const,
  // Snappy - for quick micro-interactions
  snappy: [0.2, 0, 0, 1] as const,
};

// Optimized transition configs
export const transitions = {
  // Ultra-fast micro-interactions (buttons, hovers)
  micro: {
    duration: 0.1,
    ease: easings.snappy,
  },
  // Fast micro-interactions (buttons, hovers)
  fast: {
    duration: 0.15,
    ease: easings.easeInOut,
  },
  // Normal transitions
  normal: {
    duration: 0.2,
    ease: easings.easeOut,
  },
  // Smooth page/modal transitions
  smooth: {
    duration: 0.3,
    ease: easings.easeOut,
  },
  // Sidebar expand/collapse
  sidebar: {
    duration: 0.25,
    ease: easings.easeInOut,
  },
  // Spring for playful elements
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
  // Gentle spring for cards
  gentleSpring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  },
  // Snappy spring for quick feedback
  snappySpring: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  },
};

// Stagger children animation config
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

// Fast stagger for lists
export const fastStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

// Fade in animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
};

// Fade up animation variants (most common)
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

// Fade down animation variants
export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

// Scale in animation (for modals, cards)
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transitions.fast,
  },
};

// Slide in from right
export const slideRight = {
  hidden: {
    opacity: 0,
    x: 16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
};

// Slide in from left
export const slideLeft = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
};

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.01,
    y: -1,
    transition: transitions.micro,
  },
  tap: {
    scale: 0.99,
    transition: transitions.micro,
  },
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: transitions.micro,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08 },
  },
};

// List item animation for staggered lists
export const listItem = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: easings.easeOut,
    },
  },
};

// Page transition variants
export const pageTransition = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.18,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.12,
    },
  },
};

// Modal/overlay animation
export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
};

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: 0.15,
      ease: easings.accelerate,
    },
  },
};

// Kanban card drag animation
export const kanbanCard = {
  idle: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  dragging: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: transitions.micro,
  },
};

// Progress bar animation
export const progressBar = {
  initial: { scaleX: 0 },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  }),
};

// Number counter animation helper
export const counterConfig = {
  duration: 0.6,
  ease: easings.easeOut,
};

// Sidebar animation variants - optimized for smooth expand/collapse
export const sidebarVariants = {
  expanded: {
    width: 240,
    transition: {
      duration: 0.25,
      ease: easings.easeOut,
    }
  },
  collapsed: {
    width: 72,
    transition: {
      duration: 0.3,
      delay: 0.2, // Wait for text to fade out first (text exit = 0.15s)
      ease: easings.decelerate,
    }
  }
};

// Sidebar text animation - synchronized with sidebar
export const sidebarTextVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      delay: 0.08,
      ease: easings.easeOut,
    }
  },
  collapsed: {
    opacity: 0,
    x: -4,
    transition: {
      duration: 0.12,
      delay: 0.05, // Text hides with slight delay
      ease: easings.decelerate,
    }
  }
};

// Dropdown animation
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    pointerEvents: "none" as const,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto" as const,
    transition: {
      duration: 0.18,
      ease: easings.easeOut,
    }
  }
};

// Toast notification animation
export const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: easings.easeOut,
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: easings.accelerate,
    }
  },
};

// Reduced motion check
export const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

// Get animation props based on reduced motion preference
export const getAnimationProps = (variants: Record<string, unknown>) => {
  if (prefersReducedMotion) {
    return {
      initial: variants.visible || variants.animate,
      animate: variants.visible || variants.animate,
    };
  }
  return {
    initial: variants.hidden || variants.initial,
    animate: variants.visible || variants.animate,
    exit: variants.exit,
    variants,
  };
};

// Utility to create optimized transform-only animations
export const createTransformAnimation = (
  from: { x?: number; y?: number; scale?: number; rotate?: number },
  to: { x?: number; y?: number; scale?: number; rotate?: number },
  duration = 0.2
) => ({
  initial: { ...from, opacity: from.scale === 0 ? 0 : 1 },
  animate: { ...to, opacity: 1, transition: { duration, ease: easings.easeOut } },
  exit: { ...from, opacity: from.scale === 0 ? 0 : 1, transition: { duration: duration * 0.7, ease: easings.accelerate } },
});
