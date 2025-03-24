import { config } from "@config/eslint-config/react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["./src/**/*.{ts,tsx,js.jsx}"],
    ignores: ["node_modules", "./babel.config.cjs", "./metro.config.cjs"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
