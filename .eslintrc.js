module.exports = {
  extends: ['@codex-protocol/eslint-config-vue', "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error", {
        "printWidth": 100,
        "singleQuote": true,
        "semi": false,
        "trailingComma": "es5",
        "arrowParens": "always"
      }
    ],
  }
}
