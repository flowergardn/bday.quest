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
          secondary: "teal",
        },
        darkTheme: {
          ...require("daisyui/src/theming/themes")["black"],
          primary: "pink",
          secondary: "teal",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
} satisfies Config;
