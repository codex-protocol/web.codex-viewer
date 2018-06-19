module.exports = {
  extends: ['@codex-protocol/eslint-config-vue', "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error", {
        "printWidth": 80,
        "singleQuote": true,
        "semi": false,
        "trailingComma": "es5",
        "arrowParens": "always"
      }
    ],
  }
}
