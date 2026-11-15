const parser = require("@typescript-eslint/parser");
const typescript = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: [
      "lib/**/*.js",
      "test/jest/Utilities/Logger/*.js",
      "test/jest/Providers/*.js",
      "test/mocha/Providers/Mocha/Typescript/*.js",
      "test/mocha/Scrubbers/*.js",
      "test/mocha/Reporting/Reporters/*.js",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.mts"],
    languageOptions: { parser },
    plugins: { "@typescript-eslint": typescript },
    // Original .eslintrc.json rules, enabled incrementally.
    // Duplicate keys are preserved; the last value for each key takes precedence.
    rules: {
      "indent": ["error", 2],
      "semi": ["error", "always"],
      //   "no-console": ["off"],
      "curly": ["error", "all"],
      "keyword-spacing": ["error", {}],
      "space-infix-ops": "error",
      //   "no-implicit-coercion": [
      //     "error",
      //     {
      //       "boolean": false,
      //       "string": true,
      //       "number": false
      //     }
      //   ],
      "no-with": "error",
      "no-multiple-empty-lines": ["error",  { max: 1, maxBOF: 0, maxEOF: 0 }],
      //   "brace-style": [
      //     "error",
      //     "1tbs",
      //     {
      //       "allowSingleLine": true
      //     }
      //   ],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "no-empty": "error",
      "array-bracket-spacing": ["error", "never", {}],
      "space-in-parens": ["error", "never"],
      "no-mixed-spaces-and-tabs": "error",
      //   "indent": [
      //     "error",
      //     2,
      //     {
      //       "SwitchCase": 1
      //     }
      //   ],
      "no-bitwise": "error",
      //   "camelcase": 0,
      //   "curly": "error",
      //   "eqeqeq": "error",
      //   "guard-for-in": "error",
      "no-extend-native": "error",
      "wrap-iife": "error",
      //   "indent": [
      //     2,
      //     2,
      //     {
      //       "SwitchCase": 1
      //     }
      //   ],
      //   "no-use-before-define": 0,
      //   "new-cap": 0,
      "no-caller": "error",
      //   "no-empty": "error",
      "no-irregular-whitespace": "error",
      //   "no-new": 0,
      //   "no-plusplus": 0,
      //   "quotes": 0,
      //   "no-undef": "error",
      //   "no-unused-vars": "error",
      //   "strict": 0,
      //   "max-params": 0,
      "max-depth": "error",
      //   "max-statements": 0,
      "complexity": "error",
      //   "max-len": 0,
      //   "semi": 0,
      "no-cond-assign": "error",
      "no-debugger": "error",
      //   "no-eq-null": 0,
      "no-eval": "error",
      //   "no-unused-expressions": 0,
      "block-scoped-var": "error",
      "no-iterator": "error",
      "linebreak-style": "error",
      "comma-style": [2, "last"],
      //   "no-loop-func": 0,
      "no-multi-str": "error",
      //   "require-yield": 0,
      "valid-typeof": "error",
      "no-proto": "error",
      "no-script-url": "error",
      //   "no-shadow": "error",
      //   "dot-notation": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
    //   "no-invalid-this": 0
    },
  },
];
