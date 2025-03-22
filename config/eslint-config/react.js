import { config as baseConfig } from "./base.js";
import gm from "@gm-dev/eslint-config/next";
/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  ...baseConfig,
  ...gm,
];
