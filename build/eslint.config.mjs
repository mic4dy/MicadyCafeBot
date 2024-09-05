import tseslint from "typescript-eslint";
export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked, {
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.name,
        },
    },
}, {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
}, {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
}, {
    rules: {
        "no-console": "off",
    },
});
