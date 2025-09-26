// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // TypeScript parser
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint', // TypeScript rules
      'react',              // React specific rules
      'react-hooks',        // React hooks rules
      'prettier',           // Prettier integration
    ],
    extends: [
      'react-app',
      'react-app/jest',
      'eslint:recommended',               // Recommended JS rules
      'plugin:@typescript-eslint/recommended', // Recommended TS rules
      'plugin:react/recommended',         // Recommended React rules
      'plugin:react-hooks/recommended',   // Recommended React hooks rules
      'plugin:prettier/recommended',      // Prettier integration
    ],
    rules: {
      /** ----------------------
       * React & JSX Rules
       * ---------------------- */
      'react/prop-types': 'off',          // TypeScript handles props
      'react/react-in-jsx-scope': 'off',  // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
  
      /** ----------------------
       * React Hooks Rules
       * ---------------------- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
  
      /** ----------------------
       * TypeScript Rules
       * ---------------------- */
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
  
      /** ----------------------
       * General JS Rules
       * ---------------------- */
      'no-console': ['error', { allow: ['warn', 'error'] }], // Blocks console.log
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
  
      /** ----------------------
       * Prettier formatting
       * ---------------------- */
      'prettier/prettier': ['error'],
    },
    settings: {
      react: {
        version: 'detect', // Auto-detect React version
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true,
    },
  };
  