import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';

export default [
  {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']
  },

  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue
    },

    rules: {
      // проверка на точки с запятой в конце строк
      semi: ['error', 'always'],

      // максимальная длина строки 120 символов (исключая svg)
      'max-len': [
        'error',
        {
          code: 120,
          ignorePattern: '<(svg|path|circle|rect|line|polygon|polyline|ellipse|g|defs|use|symbol|marker|clipPath|mask)'
        }
      ],

      // пробелы в фигурных скобках для импортов
      'object-curly-spacing': ['error', 'always'],

      // если больше двух атрибутов в строке - должен быть перенос
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 2
          },
          multiline: {
            max: 3
          }
        }
      ],

      // проверка на самозакрывающиеся теги
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'always'
          },
          svg: 'never',
          math: 'always'
        }
      ],

      // отступы в шаблоне (2 пробела)
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: []
        }
      ],

      // названия компонентов в PascalCase
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // запрет на запятые в конце
      'comma-dangle': [
        'error',
        {
          arrays: 'never',
          objects: 'never',
          imports: 'never',
          exports: 'never',
          functions: 'never'
        }
      ],

      // запрет использования simulateApiRequest в продакшене
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/anketa', '**/anketa.ts', '**/common', '**/common.ts'],
              importNames: ['simulateApiRequest'],
              message: 'simulateApiRequest запрещена в продакшн коде'
            }
          ]
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="simulateApiRequest"]',
          message: 'Вызов simulateApiRequest запрещен в продакшн коде'
        }
      ],

      // алфавитная сортировка элементов внутри фигурных скобок при импорте
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
        }
      ]
    }
  },

  // исключения для Icon компонентов
  {
    files: ['**/Icon*.vue', '**/assets/icons/**/*.vue', 'test-Icon*.vue'],
    rules: {
      'vue/max-attributes-per-line': 'off',
      'max-len': 'off',
      'vue/html-self-closing': 'off'
    }
  }
];
