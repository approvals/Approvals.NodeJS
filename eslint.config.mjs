import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import-x";
import globals from "globals";

export default [
  {
    ignores: [
      "**/*.d.ts",
      "**/*.d.mts",
      "lib/**/*.mjs",
      "test/**/*.mjs",
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
    languageOptions: {
      parser,
      globals: {
        ...globals.node,
        NodeJS: "readonly",
      },
    },
    plugins: { "@typescript-eslint": typescript, import: importPlugin },
    rules: {
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "@typescript-eslint/no-require-imports": "error",
      "no-self-assign": "error",
      "no-useless-assignment": "error",
      "prefer-const": "error",
      "no-var": "error",
      "indent": ["error", 2,{
        "SwitchCase": 1
      }],
      "semi": ["error", "always"],
      //   "no-console": ["off"],
      "curly": ["error", "all"],
      "keyword-spacing": ["error", {}],
      "no-multi-spaces": "error",
      "space-infix-ops": "error",
      "no-implicit-coercion": [
        "error",
        {
          "boolean": false,
          "string": true,
          "number": false
        }
      ],
      "no-with": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "brace-style": [
        "error",
        "1tbs",
        {
          "allowSingleLine": false
        }
      ],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "no-empty": "error",
      "array-bracket-spacing": ["error", "never", {}],
      "object-curly-spacing": ["error", "always"],
      "space-in-parens": ["error", "never"],
      "no-mixed-spaces-and-tabs": "error",
      "no-bitwise": "error",
      //   "camelcase": 0,
      "eqeqeq": "error",
      "guard-for-in": "error",
      "no-extend-native": "error",
      "wrap-iife": "error",
      //   "no-use-before-define": 0,
      //   "new-cap": 0,
      "no-caller": "error",
      "no-irregular-whitespace": "error",
      //   "no-new": 0,
      //   "no-plusplus": 0,
      //   "quotes": 0,
      "no-undef": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
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
      "no-unused-expressions": "error",
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
      "no-shadow": "error",
      "dot-notation": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
    //   "no-invalid-this": 0
    },
  },
  {
    files: [
      "test/mocha/**",
      "lib/Approvals.ts",
      "lib/Providers/BeforeEachVerifierBase.ts",
      "lib/Providers/Mocha/**",
    ],
    languageOptions: {
      globals: {
        ...globals.mocha,
        Mocha: "readonly",
      },
    },
  },
  {
    files: ["test/jest/**", "lib/Utilities/Logger/SimpleLoggerApprovals.ts"],
    languageOptions: { globals: globals.jest },
  },
  {
    files: ["test/vitest/**"],
    languageOptions: { globals: globals.vitest },
  },
];
