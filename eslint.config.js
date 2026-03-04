import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
	{
		files: ["**/*.{js,mjs}"],
		languageOptions: {
			globals: {
				...globals.node,
			},
			sourceType: "module",
			ecmaVersion: "latest",
		},
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
			semi: ["warn", "always"],
			quotes: ["warn", "double", { avoidEscape: true }],
		},
	},
]);
