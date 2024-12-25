// @ts-check

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            '@typescript-eslint/no-non-null-assertion': ['off'],
            '@typescript-eslint/no-unnecessary-condition': ['error', {
                allowConstantLoopConditions: true
            }],
            '@typescript-eslint/restrict-template-expressions': ['error', {
                allowNumber: true
            }]
        }
    },
)
