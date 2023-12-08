import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: [
      {
        default: {
          ...require("daisyui/src/theming/themes")["pastel"],
          primary: "pink",
          "base-100": "#f9fafb",
          secondary: "teal",
        },
        darkTheme: {
          ...require("daisyui/src/theming/themes")["black"],
          primary: "pink",
          "base-100": "#141414",
          secondary: "teal",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
