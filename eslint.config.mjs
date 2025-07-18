import js from '@eslint/js'
import globals from 'globals'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: {
      'no-case-declarations': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.jsonc'], plugins: { json }, language: 'json/jsonc', extends: ['json/recommended'] },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] }
])
