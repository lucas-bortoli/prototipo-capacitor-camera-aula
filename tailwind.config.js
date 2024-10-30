/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "InterDisplay",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    colors: {
      white: {
        0: "#ffffff",
        100: "#efefef",
        200: "#dcdcdc",
        300: "#bdbdbd",
        800: "#464646",
        900: "#3d3d3d",
      },
      "san-marino": {
        50: "#f2f7fc",
        100: "#e2ecf7",
        200: "#ccdff1",
        300: "#a9cae7",
        400: "#80aeda",
        500: "#6293cf",
        600: "#4e7ac2",
        700: "#466cb8",
        800: "#3c5691",
        900: "#344a74",
        950: "#242e47",
      },
    },
    extend: {
      boxShadow: (() => {
        const s = (n) =>
          Array.from(Array(n).keys()).map((i) => `${i + 1}px ${i + 1}px 0 0 #424242`);
        const inset_s = (n) =>
          Array.from(Array(n).keys()).map((i) => `inset ${i + 1}px ${i + 1}px 0 0 #424242`);

        return {
          pixel: s(1),
          "pixel-sm": s(2),
          "pixel-md": s(4),
          "pixel-xl": s(8),
          "inset-pixel": inset_s(1),
          "inset-pixel-sm": inset_s(2),
          "inset-pixel-md": inset_s(4),
          "inset-pixel-xl": inset_s(8),
        };
      })(),
    },
  },
  plugins: [],
};
