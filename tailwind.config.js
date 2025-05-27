/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./resources/**/*.blade.php', './resources/js/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                title: ['Poppins', 'sans-serif'],
                paragraph: ['Inter', 'sans-serif'],
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

                // ✅ Flattened dark mode
                'dark-background': '#1E1E1E',
                'dark-surface': '#273142',
                'dark-primary-hover': '#FAFFCA',
                'dark-secondary-green': '#B9D4AA',
                'dark-text-primary': '#F3F4F6',
                'dark-text-secondary': '#9CA3AF',
                'dark-border': '#374151',
            },
        },
    },
    plugins: [],
};
