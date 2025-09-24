# Introduction

This chapter shows how the starter project will be created. 

### Requirements

##### Technologies
Node.js (latest)
Git (latest)
VSCode (latest)

##### Extensions (for VSCode)
Docker
ESLint
Prettier
MongoDB

# Starting the project
In this learning we will use Vite to setup our project. We will start with creating a vite project: ```npm create vite@5.0.0```.

Then we'll direct ourselves inside th vite project and run ```npm install``` followed by ```npm run dev``` which will install pakcages and then run the application. 

An important note is that i will be using Vite to setup a react project that utilizes TypeScript. 

##### Setting up ESLint and Prettier
Just run this command: ```npm install --save-dev prettier@3.1.0 \eslint@8.54.0 \eslint-plugin-react@7.33.2 \eslint-config-prettier@9.0.0 \eslint-plugin-jsx-a11y@6.8.0```

ESLint enforces coding best practices with JS and React. Prettier enforces a code style and automatically formats code. 

##### Configuring Prettier
Inside our vite project we will add a new file called ```.prettierrc.json``` which will hold these configurations:

```json
{
    "trailingComma": "all",
    "tabWidth": 2,
    "printWidth": 80,
    "semi": false,
    "jsxSingleQuote": true,
    "singleQuote": true
}
```

We will also need to create a prettier ignore file. This will avoid prettier making changes on certain files. All we need to do for this is create a new file in our vite project called ```.prettierignore``` and add ```/dist``` within the new file. 

##### Configuring ESLint
We will create an new file in our vite project called ```.eslintrc.cjs``` with these configs:

```json
module.exports = 
    {
        "root": true,
        "env": {
            "browser": true
        },
        "parserOptions": {
            "ecmaVersion": "latest",
            "sourceType": "module"
        },
        "extends": [
            "eslint:recommended",
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
```

We will also need to create a ```.eslintignore``` file with these added to the file:

```
dist/
vite.config.js
```