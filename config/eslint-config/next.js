import pluginNext from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";
import gm from "@gm-dev/eslint-config/next"

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...gm,
  ...baseConfig,
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      "tailwindcss/no-custom-classname": "off",
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
];
