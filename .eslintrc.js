module.exports = {
  root: true,

  env: {
    node: true,
    es6: true,
  },

  extends: ['eslint:recommended'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-nested-ternary': ['error'],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'var', next: 'return' },
    ],
    'space-before-blocks': [
      'error',
      { functions: 'always', keywords: 'never', classes: 'never' },
    ],
    'space-before-function-paren': ['error', 'always'],
    'arrow-body-style': ['error', 'always'],
    'no-duplicate-imports': ['error', { includeExports: true }],
    'no-var': ['error'],
    'prefer-const': ['error'],
  },

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },

  plugins: ['graphql'],
};
