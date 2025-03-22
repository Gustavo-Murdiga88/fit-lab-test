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
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
