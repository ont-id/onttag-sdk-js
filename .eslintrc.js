module.exports = {
    root: true,
    env: {
      browser: true,
    },
    extends: [
      'airbnb-typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      'import/extensions': 'off',
    },
  };