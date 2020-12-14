module.exports = {
    extends: [
        "eslint-config-ts-base"
    ],
    parser: "babel-eslint",
    parserOptions: {
        target: "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
        module: "ESNext" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
    },
    globals: {
        Babel: true,
        before: true,
        after: true,
        chrome: true,
        logger: true
    },
    rules: {
        'max-len': [
            'error',
            160,
            2,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true
            }
        ], //强制行的最大长度
        "no-tabs": 0,
        "no-mixed-spaces-and-tabs": 0,
        "indent": [
            'error',
            4,
            {
                MemberExpression: 'off',
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1
                },
                CallExpression: {
                    arguments: 1
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoreComments: false
            }
        ],
        semi: 0
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    plugins: ["babel"],
};
