module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unicorn', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreProperties: true }],
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/no-absolute-path': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-deprecated': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': 'error',
    'import/unambiguous': 'error',
    'import/no-commonjs': 'error',
    'import/no-amd': 'error',
    'import/no-import-module-exports': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-namespace': 'error',
    'import/extensions': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        pathGroups: [
          {
            pattern: '@/config',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/main',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/common/',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/modules/',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '@/test-utils/',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-named-default': 'error',
    'import/no-default-export': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
