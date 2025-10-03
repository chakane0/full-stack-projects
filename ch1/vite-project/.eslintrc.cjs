module.exports = 
    {
        "root": true,
        "env": {
            "browser": true,
            "node": true,
            "es6": true
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

