// Responsive utility functions

export const useResponsive = () => {
  const isMobile = () => window.innerWidth < 768;
  const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = () => window.innerWidth >= 1024;
  
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
  };
};

// Responsive breakpoints following Tailwind CSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Utility classes for common responsive patterns
export const responsiveClasses = {
  container: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 sm:grid-cols-2',
    cols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  },
  spacing: {
    sm: 'space-y-4 sm:space-y-6',
    md: 'space-y-6 sm:space-y-8',
    lg: 'space-y-8 sm:space-y-12',
  },
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
  },
  padding: {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  },
  button: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base',
  },
};
