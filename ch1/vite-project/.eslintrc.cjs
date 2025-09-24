module.exports = 
    {
        "root": true,
        "env": {
            "browser": true
        },
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": "latest",
            "sourceType": "module"
        },
        "plugins": ["@typescript-eslint"],
        "extends": [
            "eslint:recommended",
            "@typescript-eslint/recommended",
            "plugin:react/recommended",
            "plugin:react/jsx-runtime",
            "plugin:jsx-a11y/recommended",
            "prettier"
        ],
        "settings": {
            "react": {
                "version": "detect"
            }
        },
        "overrides": [
            {
                "files": ["*.js", "*.jsx", "*.tsx"]
            }
        ]
    }

