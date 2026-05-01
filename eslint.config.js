import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-undef': 'off',
      'no-empty': 'off',
      'no-fallthrough': 'off',
      'no-unsafe-finally': 'off',
      'no-cond-assign': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',
      'getter-return': 'off',
      'no-control-regex': 'off'
    }
  }
);