export default {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        primary: '#84AE92',
        'primary-dark': '#5A827E',
        'secondary-green': '#B9D4AA',
        'text-primary': '#1F2937',
        'text-secondary': '#4B5563',
        border: '#E5E7EB',

        // Dark mode overrides
        dark: {
          background: '#1F2937',
          surface: '#273142',
          primary: '#84AE92',
          'primary-hover': '#FAFFCA',
          'secondary-green': '#B9D4AA',
          'text-primary': '#F3F4F6',
          'text-secondary': '#9CA3AF',
          border: '#374151',
        },
      },
    },
  },
  plugins: [],
}
