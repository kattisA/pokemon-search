import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pokemon-theme': "url('/pokemon_frenchie.jpg')",
      },
      backgroundColor: {
        'yellow-custom': '#feca1b',
        'dark-yellow-custom': '#e0b610',
        'dark-yellow-custom-hover': '#cba115',
      },
      hoverBackgroundColor: {
        'yellow-custom-dark': '#e5b917',
        'dark-yellow-focus': '#e0b610'
      },
      ringColor: {
        'yellow-focus': '#feca1b',
      },
      borderColor: {
        'yellow-border': '#fee48d',
        'dark-yellow-border': '#987910'
      }
    },
  },
  plugins: [],
}
export default config
