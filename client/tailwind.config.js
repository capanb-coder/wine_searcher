/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d6',
          300: '#f4aab5',
          400: '#ec7589',
          500: '#e04d67',
          600: '#cc2f4d',
          700: '#ac2240',
          800: '#8b1a2c',  // main burgundy
          900: '#721929',
          950: '#3e0a14'
        },
        gold: {
          300: '#e8d08a',
          400: '#d4b84a',
          500: '#c9a84c',  // main gold
          600: '#a88838',
          700: '#876a28'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'wine-gradient': 'linear-gradient(135deg, #0f0608 0%, #1a0a0e 50%, #0d0507 100%)'
      }
    }
  },
  plugins: []
};
