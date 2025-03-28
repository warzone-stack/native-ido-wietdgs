/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#F5CF65',
          disabled: 'rgba(245, 207, 101, 0.5)',
        },
        success: {
          light: '#27EBAD',
          dark: '#07D996',
        },
        warning: {
          strong: {
            light: '#EC584C',
            dark: '#F5685D',
          },
          weak: {
            light: '#EB8D27',
            dark: '#FE992B',
          },
        },
        background: {
          light: '#FFFFFF',
          dark: '#212226',
        },
        text: {
          light: '#000',
          dark: '#FFFFFF',
        },
      },
      borderRadius: {
        xl: '20px',
        lg: '16px',
        md: '12px',
        sm: '8px',
        none: '0px',
      },
    },
  },
  plugins: [],
};
