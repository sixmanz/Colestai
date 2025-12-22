/* ============================================
   TAILWIND CONFIG - Shared configuration
   ============================================ */

// This configuration is loaded before Tailwind CDN
// and defines the custom theme for all pages

window.tailwindConfig = {
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'Noto Sans Thai', 'sans-serif'],
                'thai': ['Noto Sans Thai', 'Inter', 'sans-serif'],
                'display': ['Comfortaa', 'cursive'],
            },
            colors: {
                'primary': '#003366',
                'primary-dark': '#002244',
                'primary-light': '#004488',
                'secondary': '#56C4E8',
                'secondary-dark': '#3BA8CC',
                'secondary-light': '#7DD4F0',
                'blue-primary': '#003366',
                'sky-primary': '#56C4E8',
                'purple-primary': '#003366',
                'pink-primary': '#56C4E8',
                'dark-bg': '#F8FAFC',
                'dark-card': '#FFFFFF',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        }
    }
};

// Apply config if Tailwind is already loaded
if (typeof tailwind !== 'undefined') {
    tailwind.config = window.tailwindConfig;
}
