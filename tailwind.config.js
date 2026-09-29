/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EFE5CE',
          300: '#DEC99E',
          400: '#CCA86E',
          500: '#B8863B',
          600: '#9C6928',
          700: '#7E4E1D',
          800: '#643C1B',
          900: '#4F3019',
        },
        terracotta: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#EA580C',
          600: '#C2410C',
          700: '#9A3412',
        },
        indigokingdom: {
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Raleway', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        raleway: ['Raleway', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        quicksand: ['Quicksand', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        lemon: ['"Lemon Tuesday"', 'cursive', 'sans-serif'],
        script: ['"Lemon Tuesday"', 'cursive', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        editorial: '0.04em',
        headline: '-0.02em',
        subtitle: '0.16em',
      },
      lineHeight: {
        editorial: '1.75',
        headline: '1.15',
      },
      boxShadow: {
        'heritage-card': '0 10px 30px -5px rgba(126, 78, 29, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'heritage-hover': '0 20px 35px -5px rgba(126, 78, 29, 0.16), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        editorial: '0 1px 3px rgba(0,0,0,0.04), 0 20px 60px -12px rgba(80,50,20,0.12)',
      },
    },
  },
  plugins: [],
};
