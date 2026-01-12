/** @type {import('tailwindcss').Config} */
export default {
  content: [
    '.vitepress/**/*.{js,mts,ts,vue}',
    'src/demos/**/*.{js,mts,ts,vue}',
    'src/**/*.md',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
