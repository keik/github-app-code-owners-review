module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        "newlines-between": "always",
      },
    ],
  },
};
