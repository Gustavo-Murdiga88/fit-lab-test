import { nextJsConfig } from "@config/eslint-config/next-js";
import next from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    files: ["./src/**/*.{ts,tsx,js.jsx}"],
    rules: {
      ...next.configs["core-web-vitals"].rules,
      ...next.configs.recommended.rules,
    },
    plugins: {
      ...next.configs["core-web-vitals"].plugins,
      ...next.configs.recommended.plugins,
    },
  },
];
