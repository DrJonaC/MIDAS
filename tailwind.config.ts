import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', '"Book Antiqua"', "Georgia", "serif"],
        body: ['"Aptos"', '"Segoe UI"', '"Trebuchet MS"', "sans-serif"]
      },
      colors: {
        night: "#050816",
        mist: "#9fb0d9",
        glow: "#72e0d1",
        ember: "#ff8a5b",
        starlight: "#dff8ff",
        abyss: "#02050d"
      },
      boxShadow: {
        aura: "0 0 0 1px rgba(114,224,209,0.15), 0 18px 40px rgba(4,10,27,0.45)",
        pulse: "0 0 30px rgba(114,224,209,0.18)",
        halo: "0 0 0 1px rgba(188,240,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px rgba(0,0,0,0.38)"
      },
      backgroundImage: {
        "radial-veil":
          "radial-gradient(circle at top, rgba(114,224,209,0.12), transparent 28%), radial-gradient(circle at 85% 10%, rgba(255,138,91,0.12), transparent 22%)",
        filament:
          "linear-gradient(90deg, transparent 0%, rgba(233, 249, 255, 0.7) 49%, transparent 100%)"
      }
    }
  },
  plugins: []
};

export default config;
