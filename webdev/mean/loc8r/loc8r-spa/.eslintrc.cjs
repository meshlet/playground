module.exports = {
  "extends": [
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "env": {
    "browser": true,
    "es2017": true,
    "commonjs": true,
    "node": true
  },
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 8,
    "tsconfigRootDir": __dirname,
    "project": [
      "./modules/loc8r-common/tsconfig.json",
      "./modules/loc8r-restapi/tsconfig.json",
      "./modules/loc8r-ng/tsconfig.eslint.json"]
  },
  "plugins": [
    "@typescript-eslint",
    "@babel"
  ],
  "ignorePatterns": ["*.js", "*.cjs"],
  "rules": {
    "semi": ["error", "always"],
    "@babel/semi": "error",
    "space-before-function-paren": ["error", "never"],
    "indent": [
      "error",
      2,
      {
        "FunctionDeclaration": { "parameters": "first" },
        "FunctionExpression": { "parameters": "first"},
        "SwitchCase": 1
      }
    ],
    "brace-style": [
      "error",
      "stroustrup",
      { "allowSingleLine": true }
    ],
    "no-void": [
      "error",
      { "allowAsStatement": true }
    ],
    "@typescript-eslint/no-floating-promises": [
      "error",
      { "ignoreVoid": false }
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-ignore": "allow-with-description", "minimumDescriptionLength": 10 }
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": ["error"],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "multilineDetection": "brackets",
        "overrides": {
          "interface": {
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            },
            "singleline": {
              "delimiter": "semi",
              "requireLast": true
            }
          }
        }
      }
    ]
  }
}
