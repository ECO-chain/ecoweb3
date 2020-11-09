module.exports = {
  extends: "airbnb-base",
  env: {
    node: true,
    mocha: true,
    browser: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "class-methods-use-this": 0,
    "max-len": [
      2,
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
      },
    ],
    "no-console": 0,
    "max-len": 0,
    "no-plusplus": 0,
    "import/no-dynamic-require": 0,
    "object-curly-newline": [
      2,
      {
        ImportDeclaration: "never",
      },
    ],
  },
};
