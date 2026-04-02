/**
 * Shared theme constants for Leisure Lake Website
 * Centralizes Framer Motion configurations and common styling.
 */

export const easing = [0.16, 1, 0.3, 1];

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: easing } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.05 } 
  }
};

export const scrollFadeUp = { 
  initial: "hidden", 
  whileInView: "visible", 
  viewport: { once: true, margin: "-50px" }, 
  variants: fadeInUp 
};

export const scrollStagger = {
  initial: "hidden", 
  whileInView: "visible", 
  viewport: { once: true, margin: "-50px" }, 
  variants: staggerContainer
};

export const fontPlayfair = { fontFamily: "'Playfair Display', serif" };
export const fontDancing = { fontFamily: "'Dancing Script', 'Playfair Display', cursive" };

/**
 * Generates a consistent pastel color based on a string (e.g., guest name)
 */
export const getRandomPastel = (name) => {
  if (!name) return '#f5f5f4';
  const hues = [20, 45, 160, 200, 280, 320];
  const nameHash = Array.from(name).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = hues[Math.abs(nameHash) % hues.length];
  return `hsl(${hue}, 30%, 90%)`;
};
