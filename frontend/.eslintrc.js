// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // TypeScript parser
    parserOptions: {
      ecmaVersion: 2021, // Modern JS syntax
      sourceType: 'module', // Enable imports
      ecmaFeatures: {
        jsx: true, // Enable JSX parsing
      },
    },
    plugins: [
      '@typescript-eslint', // TypeScript-specific rules
      'react',              // React rules
      'react-hooks',        // React hooks rules
      'prettier',           // Prettier integration
    ],
    extends: [
      'react-app',
      'react-app/jest',
      'eslint:recommended',                  // Recommended JS rules
      'plugin:@typescript-eslint/recommended', // Recommended TS rules
      'plugin:react/recommended',            // Recommended React rules
      'plugin:react-hooks/recommended',      // Recommended React hooks rules
      'plugin:prettier/recommended',         // Prettier integration
    ],
    rules: {
      /** ----------------------
       * React & JSX Rules
       * ---------------------- */
      'react/prop-types': 'off',          // TypeScript handles props
      'react/react-in-jsx-scope': 'off',  // Not needed in React 17+
      'react/jsx-uses-vars': 'error',     // Prevent unused JSX variables
  
      /** ----------------------
       * React Hooks Rules
       * ---------------------- */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing deps
  
      /** ----------------------
       * TypeScript Rules
       * ---------------------- */
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Allow _ prefix
      '@typescript-eslint/explicit-function-return-type': 'off', // Let TS infer
  
      /** ----------------------
       * General JS Rules
       * ---------------------- */
      'no-console': ['error', { allow: ['warn', 'error'] }], // Blocks console.log
      'no-debugger': 'error',                                 // Prevent debugger
      eqeqeq: ['error', 'always'],                            // Require ===
      curly: ['error', 'all'],                                // Always use curly braces
  
      /** ----------------------
       * Prettier Formatting
       * ---------------------- */
      'prettier/prettier': ['error'], // Make prettier issues show as ESLint errors
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
    overrides: [
      {
        files: ['*.ts', '*.tsx'], // Apply TypeScript rules only to TS files
        rules: {
          '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
      },
      {
        files: ['*.js', '*.jsx'], // JS-specific overrides
        rules: {},
      },
    ],
  };
  