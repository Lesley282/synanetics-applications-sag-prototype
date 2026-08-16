import eslint from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

import prettierConfig from 'eslint-config-prettier/flat'
import prettierPlugin from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  jsxA11y.flatConfigs.recommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  prettierConfig,

  {
    ignores: [
      '**/test',
      '**/coverage',
      '**/dist',
      '**/**.config.ts',
      '**/eslint.config.js',
      '**/node_modules',
      '**/scripts',
    ],
  },
  {
    files: ['**/*.{js,ts,tsx}'],

    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        __dirname: true,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'jsx-a11y/anchor-is-valid': ['warn'],
      'jsx-a11y/alt-text': ['warn'],
      'jsx-a11y/label-has-associated-control': ['warn'],
      'jsx-a11y/click-events-have-key-events': ['warn'],
      'jsx-a11y/no-static-element-interactions': ['warn'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
  },
)
