import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ['*.js'],
        plugins: { '@stylistic/js': stylisticJs },
        rules: {
            '@stylistic/js/indent': ['error', 4],
            '@stylistic/js/linebreak-style': ['error', 'windows'],
            '@stylistic/js/quotes': ['error', 'single'],
            '@stylistic/js/semi': ['error', 'never'],
            'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': [
                'error', 'always'
            ],
            'arrow-spacing': [
                'error', { 'before': true, 'after': true }
            ],
            'no-console': 0
        }
    },
    { ignores: ['dist'] }
]