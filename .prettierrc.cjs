module.exports = {
  "semi": false,
  "singleQuote": true,

  "requirePragma": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "arrowParens": "always",
  "bracketSpacing": true,
  "jsxSingleQuote": false,

  "overrides": [
    {
      "files": "*.svg",
      "options": {
        "parser": "html",
        "singleQuote": false,
        "semi": false
      }
    }
  ]
}
