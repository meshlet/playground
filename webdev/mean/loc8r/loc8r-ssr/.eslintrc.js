module.exports = {
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['*.js', 'dist/**/*'],
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    indent: [
      'error',
      2,
      { FunctionDeclaration: { parameters: 'first' } }
    ],
    'brace-style': [
      'error',
      'stroustrup',
      { allowSingleLine: true }
    ],
    '@typescript-eslint/no-floating-promises': [
      'error',
      { ignoreVoid: false }
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 10 }
    ],
    '@typescript-eslint/no-unused-vars': 'error'
  }
};
