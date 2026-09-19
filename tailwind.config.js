/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0B14',
        canvas: '#08060C',
        surface: '#161224',
        lilac: '#9D7BFF',
        muted: '#A392C9',
        startRed: '#FF4D4D',
        deadRed: '#990000',
        acceptGreen: '#00E676',
        correctGreen: '#10B981',
        wrongRed: '#EF4444',
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
