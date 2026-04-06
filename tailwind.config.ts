import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Ensure this line exists
    "./(auth)/**/*.{js,ts,jsx,tsx,mdx}",   // Add this line for the auth folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;