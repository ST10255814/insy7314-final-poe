import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import securityPlugin from "eslint-plugin-security";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["package-lock.json", "node_modules/**"], 
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, security: securityPlugin },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      ...securityPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
]);
