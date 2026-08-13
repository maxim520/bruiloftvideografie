import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // studio/ is een apart project met een eigen eslint.config.mjs
    // (@sanity/eslint-config-studio) en eigen node_modules. Zonder deze
    // ignore lint ESLint's flat config (geen automatische per-map-config
    // zoals het oude .eslintrc-cascadesysteem) studio/-bestanden gewoon
    // mee onder de Next.js-regels hierboven — geen echte studio-lint,
    // alleen toevallige ruis. Zie studio/package.json's eigen `lint`-script.
    "studio/**",
  ]),
]);

export default eslintConfig;
