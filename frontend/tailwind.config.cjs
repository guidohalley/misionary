/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = 'safelist.txt'

// colors.indigo
const SAFELIST_COLORS = 'colors'

module.exports = {
	mode: 'jit',
	content:  [
		"./index.html",
    	"./src/**/*.{js,ts,jsx,tsx}", 
		'./safelist.txt'
	],
	darkMode: 'class',
		theme: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'"Helvetica Neue"',
					'Arial',
					'"Noto Sans"',
					'sans-serif',
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"',
				],
				serif: [
					'ui-serif',
					'Georgia',
					'Cambria',
					'"Times New Roman"',
					'Times',
					'serif',
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'"Liberation Mono"',
					'"Courier New"',
					'monospace',
				],
			},
			screens: {
				xs: '576',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px',
			},
			extend: {
				colors: {
					// Paleta Misionary (Verde Neón como 600)
					misionary: {
						500: '#F3FF9C',
						600: '#E9FC87',
						700: '#CBE65D',
					},
					// Paleta gris oscuro para alto contraste
					msgray: {
						50:  '#F2F2F2',
						100: '#E6E6E6',
						200: '#CCCCCC',
						300: '#B3B3B3',
						400: '#999999',
						500: '#666666',
						600: '#262626', // Gris Oscuro de marca
						700: '#1F1F1F',
						800: '#141414',
						900: '#0A0A0A',
						950: '#000000',
					},
					// NUEVOS COLORES MISIONARY - Solo para emails y branding específico
					brand: {
						// Verde Neón oficial
						primary: '#E9FC87',
						'primary-light': '#F3FF9C',
						'primary-dark': '#CBE65D',
						// Gris Oscuro oficial
						dark: '#262626',
						'dark-light': '#404040',
						// Violeta Claro oficial
						accent: '#BCB4FF',
						'accent-light': '#D4C7FF',
						// Blanco oficial
						light: '#F2F2F2',
					},
				},
				typography: (theme) => ({
					DEFAULT: {
						css: {
							color: theme('colors.gray.500'),
							maxWidth: '65ch',
						},
					},
					invert: {
						css: {
							color: theme('colors.gray.400'),
						},
					},
				}),
			},
		},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require('./twSafelistGenerator')({
            path: safeListFile,
            patterns: [
                `text-{${SAFELIST_COLORS}}`,
				`bg-{${SAFELIST_COLORS}}`,
				`dark:bg-{${SAFELIST_COLORS}}`,
				`dark:hover:bg-{${SAFELIST_COLORS}}`,
				`dark:active:bg-{${SAFELIST_COLORS}}`,
				`hover:text-{${SAFELIST_COLORS}}`,
				`hover:bg-{${SAFELIST_COLORS}}`,
				`active:bg-{${SAFELIST_COLORS}}`,
				`ring-{${SAFELIST_COLORS}}`,
				`hover:ring-{${SAFELIST_COLORS}}`,
				`focus:ring-{${SAFELIST_COLORS}}`,
				`focus-within:ring-{${SAFELIST_COLORS}}`,
				`border-{${SAFELIST_COLORS}}`,
				`focus:border-{${SAFELIST_COLORS}}`,
				`focus-within:border-{${SAFELIST_COLORS}}`,
				`dark:text-{${SAFELIST_COLORS}}`,
				`dark:hover:text-{${SAFELIST_COLORS}}`,
				`h-{height}`,
				`w-{width}`,
            ],
        }),
        require('@tailwindcss/typography'),
	],
};
