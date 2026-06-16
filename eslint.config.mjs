import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Enforce next/image over raw <img>. core-web-vitals ships this as a warning;
  // promote it to an error so a stray raw <img> fails `npm run lint`. The few
  // intentional exceptions (SVGs, the external flag, the preloader marks, and
  // images whose assets don't exist on disk yet) carry scoped disable comments.
  {
    rules: {
      "@next/next/no-img-element": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local-only throwaway git worktrees — never lint these.
    ".claude/**",
  ]),
]);

export default eslintConfig;
