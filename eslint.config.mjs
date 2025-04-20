import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Aturan khusus untuk Next.js
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Mencegah import React yang tidak perlu di Next.js dengan versi React 17+
      "react/react-in-jsx-scope": "off",

      // Best practices
      "react/prop-types": "off", // Tidak diperlukan dengan TypeScript
      "react/jsx-no-target-blank": "error", // Keamanan link eksternal
      "react/no-unescaped-entities": "warn",
      "react/display-name": "error",

      // Next.js Image component
      "@next/next/no-img-element": "warn", // Sarankan menggunakan komponen Next Image

      // Accessibility
      "jsx-a11y/alt-text": "warn", // Pastikan ada alt text pada gambar
      "jsx-a11y/anchor-is-valid": "warn", // Untuk penggunaan Link yang tepat

      // TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Hindari penggunaan type any

      // Formatting
      "no-console": ["warn", { allow: ["warn", "error"] }], // Hindari console.log di production
    }
  },

  // Aturan khusus untuk file API
  {
    files: ["src/pages/api/**/*.{js,ts}"],
    rules: {
      "import/no-anonymous-default-export": "off"
    }
  }
];

export default eslintConfig;
