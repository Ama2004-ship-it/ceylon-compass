/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#eef8fc',
          100: '#d7edf6',
          200: '#b3dcee',
          300: '#82c3e2',
          400: '#4aa3d0',
          500: '#2685b8',
          600: '#1a6a99',
          700: '#18557c',
          800: '#194867',
          900: '#193d56',
          950: '#0f2739',
        },
        sand: {
          50: '#fdfaf3',
          100: '#faf2e1',
          200: '#f3e2bd',
          300: '#eaca8b',
          400: '#e0ac5a',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0f2739 0%, #18557c 45%, #2685b8 100%)',
        'wave-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z'%3E%3C/path%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 39, 57, 0.25)',
        'card-hover': '0 20px 40px -12px rgba(15, 39, 57, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
