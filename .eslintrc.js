module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier"],
  globals: {
    console: true,
    module: true,
    require: true,
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": ["error"],
    indent: 0,
    "react/jsx-indent": 0,
    "react/jsx-wrap-multilines": 0,
    "react/jsx-curly-spacing": [2, { when: "never", children: true }],
    "react/jsx-indent-props": [0, 5],
    "import/no-unresolved": [0, { caseSensitive: false }],
    "no-prototype-builtins": 0,
    "linebreak-style": 0,
    // Strict mode
    strict: [2, "global"],
    // Variables
    "no-shadow": 2,
    "no-shadow-restricted-names": 2,
    "no-unused-vars": [
      2,
      {
        vars: "local",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],
    // Possible errors
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],
    "comma-dangle": [0, "never"],
    "no-cond-assign": [2, "except-parens"],
    "no-console": 1,
    "no-debugger": 2,
    "no-alert": 1,
    "no-constant-condition": 1,
    "no-duplicate-case": 2,
    "no-empty": 2,
    "no-ex-assign": 2,
    "no-extra-boolean-cast": 0,
    "no-extra-semi": 2,
    "no-func-assign": 2,
    "no-inner-declarations": 2,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-obj-calls": 2,
    "no-sparse-arrays": 2,
    "no-unreachable": 2,
    "use-isnan": 2,
    "block-scoped-var": 2,
    "import/no-extraneous-dependencies": 0,
    "prefer-rest-params": 0,
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    // Best practices
    "react/jsx-curly-newline": 0,
    "react/require-default-props": 0,
    "react/destructuring-assignment": 0,
    "consistent-return": 2,
    curly: [2, "multi-line"],
    "default-case": 2,
    "dot-notation": [
      2,
      {
        allowKeywords: true,
      },
    ],
    eqeqeq: 2,
    "guard-for-in": 2,
    "no-caller": 2,
    "no-else-return": 2,
    "no-eq-null": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-fallthrough": 2,
    "no-floating-decimal": 2,
    "no-implied-eval": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-multi-str": 2,
    "no-native-reassign": 2,
    "no-new": 2,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-octal": 2,
    "no-octal-escape": 2,
    "no-param-reassign": [
      2,
      {
        props: false,
      },
    ],
    "no-proto": 2,
    "no-redeclare": 2,
    "no-return-assign": 2,
    "no-return-await": 0,
    "no-script-url": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-throw-literal": 2,
    "no-with": 2,
    radix: 0,
    "vars-on-top": 0,
    "wrap-iife": [2, "any"],
    yoda: 2,
    "no-mixed-spaces-and-tabs": 2,
    "no-regex-spaces": 2,
    "no-use-before-define": 2,
    "no-new-symbol": 2,
    "no-this-before-super": 2,
    "no-undef": 2,
    "no-unsafe-finally": 2,
    "no-unexpected-multiline": 2,
    "no-self-assign": 2,
    "no-unsafe-negation": 2,
    "no-unused-labels": 2,
    "no-useless-escape": 2,
    "require-yield": 2,
    "valid-typeof": 2,
    "no-dupe-class-members": 2,
    "no-dupe-keys": 2,
    "no-global-assign": 2,
    "no-delete-var": 2,
    "no-dupe-args": 2,
    "for-direction": 2,
    "no-empty-character-class": 2,
    "no-empty-pattern": 2,
    "no-compare-neg-zero": 2,
    "getter-return": 2,
    "no-case-declarations": 2,
    "no-class-assign": 2,
    // Style
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: true,
      },
    ],
    quotes: [2, "single", "avoid-escape"],
    "object-curly-spacing": [0, "never"],
    "comma-spacing": [
      2,
      {
        before: false,
        after: true,
      },
    ],
    "comma-style": [2, "last"],
    "eol-last": 2,
    "func-names": 1,
    "key-spacing": [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "new-cap": [
      2,
      {
        newIsCap: true,
      },
    ],
    "no-multiple-empty-lines": [
      2,
      {
        max: 2,
      },
    ],
    "no-nested-ternary": 2,
    "no-new-object": 2,
    "no-spaced-func": 2,
    "no-trailing-spaces": 2,
    "no-extra-parens": [2, "functions"],
    "no-underscore-dangle": 0,
    "one-var": [2, "never"],
    "padded-blocks": [2, "never"],
    semi: [2, "always"],
    "semi-spacing": [
      2,
      {
        before: false,
        after: true,
      },
    ],
    "keyword-spacing": 2,
    "space-before-blocks": 2,
    "space-before-function-paren": [0, "never"],
    "space-infix-ops": 2,
    "spaced-comment": [
      2,
      "always",
      {
        markers: ["global", "eslint"],
      },
    ],
  },
};
