/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // Add your existing screens here
        "video-center": { raw: "(max-width: 768px)" },
      },
      className: {
        "video-center": {
          "@screen video-center": {
            "@apply flex justify-center": true,
          },
          "@screen !video-center": {
            "@apply mx-auto": true,
          },
        },
      },
    },
  },
  plugins: [],
};
