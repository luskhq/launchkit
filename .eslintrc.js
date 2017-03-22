module.exports = {
  env: { es6: true, node: true },
  rules: {
    // Errors
    eqeqeq: ["error", "smart"],
    "no-cond-assign": "error",
    "no-const-assign": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-func-assign": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-sparse-arrays": "error",
    "no-undef": "error",
    "no-unused-vars": "error",
    "no-use-before-define": ["error", "nofunc"],
    "no-var": "error",

    // Warnings
    "no-console": "warn",
    "no-constant-condition": "warn",
    "no-fallthrough": "warn",
    "no-unneeded-ternary": "warn",
    "object-shorthand": "warn",
    "prefer-arrow-callback": "warn",
    "prefer-const": "warn",
    "prefer-spread": "warn"
  }
};
