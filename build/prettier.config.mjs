export default [
    {
        parser: "typescript",
        semi: false,
        singleQuote: true,
        trailingComma: "all",
        overrides: [
            {
                files: ["*.js"],
                options: {
                    parser: "babel",
                },
            },
        ],
    },
];
