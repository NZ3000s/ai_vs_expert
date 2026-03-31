import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Explicit base path so Tailwind scans /components, /hooks, etc. (not only /app). */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: path.resolve(__dirname),
    },
  },
};

export default config;
