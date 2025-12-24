import type { Config } from 'tailwindcss';
import { labUITheme } from './src/tokens/tailwind.config';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: labUITheme,
  },
  plugins: [],
};

export default config;

