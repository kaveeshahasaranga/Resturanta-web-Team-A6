module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  // Existing presentation components contain unused decorative imports.
  rules: { 'no-unused-vars': 'off' },
  ignorePatterns: ['dist/', 'node_modules/'],
};
