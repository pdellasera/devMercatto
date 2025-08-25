import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Mobile First breakpoints
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Mobile-specific spacing
      spacing: {
        'mobile-xs': '0.25rem',    // 4px
        'mobile-sm': '0.5rem',     // 8px
        'mobile-md': '0.75rem',    // 12px
        'mobile-lg': '1rem',       // 16px
        'mobile-xl': '1.25rem',    // 20px
        'mobile-2xl': '1.5rem',    // 24px
        'mobile-3xl': '2rem',      // 32px
        'mobile-4xl': '2.5rem',    // 40px
      },
      // Mobile-specific font sizes
      fontSize: {
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'mobile-base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'mobile-4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      },
      // Mobile-specific border radius
      borderRadius: {
        'mobile-sm': '0.25rem',   // 4px
        'mobile-md': '0.375rem',  // 6px
        'mobile-lg': '0.5rem',    // 8px
        'mobile-xl': '0.75rem',   // 12px
        'mobile-2xl': '1rem',     // 16px
        'mobile-3xl': '1.5rem',   // 24px
      },
      // Mobile-specific shadows
      boxShadow: {
        'mobile-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'mobile-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'mobile-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'mobile-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      // Mobile-specific z-index
      zIndex: {
        'mobile-overlay': '1000',
        'mobile-modal': '1100',
        'mobile-tooltip': '1200',
        'mobile-toast': '1300',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        // Mobile-specific animations
        'mobile-slide-up': 'mobileSlideUp 0.25s ease-out',
        'mobile-fade-in': 'mobileFadeIn 0.2s ease-in-out',
        'mobile-scale-in': 'mobileScaleIn 0.15s ease-out',
        'mobile-bounce-in': 'mobileBounceIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Mobile-specific keyframes
        mobileSlideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        mobileFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        mobileScaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        mobileBounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
