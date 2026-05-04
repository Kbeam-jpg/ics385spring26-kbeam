/*
Name: Kendall Beam
Assignment: Term Project 3
Description: for running eslint
Filename: eslint config.js (npm run lint)
Date: May 3 2026

Notes: 5/3/26
  auth.test.js throws a bunch of errors for jest terms
  src/index.jsx throws a fast refresh error, I think because of nested JSX.Element functions? Maybe move <App /> to its own file?
  src/components/WeatherWidget.jsx throws a setState sync error, setLoading(true) is set in a useEffect(), but doesn't impact performance
*/

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // globalIgnores(['dist']), // <uncomment if /dist is causing problems
  /** frontend files, globals is scoped to browser */
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  /** backend files, only difference is globals is scoped to node.js  */
  {
    files: ['server.js', 'passport-config.js', 'routes/**/*.js', 'models/**/*.js', 'middleware/**/*.js', 'seed/**/*.js', 'tests/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
