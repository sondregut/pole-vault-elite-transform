
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'pacifico': ['Pacifico', 'cursive'],
				'inter': ['Inter', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#3176FF', // Primary color
					foreground: '#FFFFFF',
					light: '#E6EFFF', // Lighter shade
					dark: '#1E293B', // Secondary color
				},
				secondary: {
					DEFAULT: '#1E293B',
					foreground: '#FFFFFF',
					light: '#D1FAE5',
					dark: '#047857',
				},
				// PVT Brand Colors
				'brand-violet': {
					700: '#7B3AF5',
					400: '#A47BFF',
					100: '#F3EFFF',
				},
				'canvas-light': '#FFFFFF',
				'canvas-dark': '#17141E',
				'content-primary': '#0E0D0F',
				'content-secondary': '#55546B',
				'success-ring-green': '#32D05F',
				'warning-ring-orange': '#FF9F1C',
				'info-ring-blue': '#3AA3FF',
				'surface-card': '#F8F7FC',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gray: {
					300: '#D1D5DB',
					400: '#9CA3AF',
					600: '#4B5563',
				},
				// VAULT App Brand Colors
				vault: {
					primary: '#072f57',
					'primary-light': '#0a4a8a',
					'primary-dark': '#051d38',
					'primary-muted': '#e8eef4',
					'bg-warm-start': '#f5f0eb',
					'bg-warm-end': '#d9d0c7',
					'text': '#072f57',
					'text-secondary': '#404040',
					'text-muted': '#6b6b6b',
					'border': '#e5e5e5',
					'border-light': '#f0f0f0',
					success: '#198754',
					warning: '#F59E0B',
					error: '#EF4444',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				none: '0px',
				DEFAULT: '8px',
				button: '8px',
				full: '9999px',
				'xl': '20px',
				'2xl': '24px',
				'3xl': '32px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-in-right': 'fade-in-right 0.4s ease-out'
			},
			boxShadow: {
				'vault-sm': '0 2px 4px rgba(7, 47, 87, 0.04)',
				'vault': '0 4px 8px rgba(7, 47, 87, 0.06)',
				'vault-md': '0 8px 16px rgba(7, 47, 87, 0.08)',
				'vault-lg': '0 12px 24px rgba(7, 47, 87, 0.1)',
				'vault-card': '0 4px 12px rgba(7, 47, 87, 0.05)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
