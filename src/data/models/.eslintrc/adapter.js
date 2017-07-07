module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  env: {
    'browser': true
  },
  rules: {
    // TODO: Remove this to ensure we handle errors properly in UI
    "no-empty": ["error", { "allowEmptyCatch": true }],

    // enforce spacing inside array brackets
    'array-bracket-spacing': [2, 'never'],

    // enforce spacing inside single-line blocks
    // http://eslint.org/docs/rules/block-spacing
    'block-spacing': [2, 'always'],

    // enforce one true brace style
    'brace-style': [2, '1tbs', { allowSingleLine: true }],

    // require camel case names
    'camelcase': 0,

    // enforce spacing before and after comma
    'comma-spacing': [2, { before: false, after: true }],

    // enforce one true comma style
    'comma-style': [2, 'last'],

    // disallow padding inside computed properties
    'computed-property-spacing': [2, 'never'],

    // enforces consistent naming when capturing the current execution context
    'consistent-this': 0,

    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': 2,

    // enforces use of function declarations or expressions
    'func-style': 0,

    // Blacklist certain identifiers to prevent them being used
    // http://eslint.org/docs/rules/id-blacklist
    'id-blacklist': 0,

    // this option enforces minimum and maximum identifier lengths
    // (variable names, property names etc.)
    'id-length': 0,

    // require identifiers to match the provided regular expression
    'id-match': 0,

    // this option sets a specific tab width for your code
    // http://eslint.org/docs/rules/indent
    'indent': [2, 2, { SwitchCase: 1, VariableDeclarator: 1}],

    // enforces spacing between keys and values in object literal properties
    'key-spacing': [2, { beforeColon: false, afterColon: true }],

    // require a space before & after certain keywords
    'keyword-spacing': [2, {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true }
      }
    }],

    // disallow mixed 'LF' and 'CRLF' as linebreaks
    'linebreak-style': 0,

    // enforces empty lines around comments
    'lines-around-comment': 0,

    // specify the maximum depth that blocks can be nested
    'max-depth': [0, 4],

    // specify the maximum length of a line in your program
    // http://eslint.org/docs/rules/max-len
    'max-len': [2, 100, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],

    // specify the max number of lines in a file
    // http://eslint.org/docs/rules/max-lines
    'max-lines': [0, {
      max: 300,
      skipBlankLines: true,
      skipComments: true
    }],

    // specify the maximum depth callbacks can be nested
    'max-nested-callbacks': 0,

    // limits the number of parameters that can be used in the function declaration.
    'max-params': [0, 3],

    // specify the maximum number of statement allowed in a function
    'max-statements': [0, 10],

    // restrict the number of statements per line
    // http://eslint.org/docs/rules/max-statements-per-line
    'max-statements-per-line': [0, { max: 1 }],

    // TODO: Figure way around this. Problematic is currently our use of
    // Ember.A().
    // require a capital letter for constructors
    // 'new-cap': [2, { newIsCap: true }],

    // disallow the omission of parentheses when invoking a constructor with no arguments
    'new-parens': 0,

    // allow/disallow an empty newline after var statement
    'newline-after-var': 0,

    // http://eslint.org/docs/rules/newline-before-return
    'newline-before-return': 0,

    // enforces new line after each method call in the chain to make it
    // more readable and easy to maintain
    // http://eslint.org/docs/rules/newline-per-chained-call
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 4 }],

    // disallow use of the Array constructor
    'no-array-constructor': 2,

    // disallow use of bitwise operators
    'no-bitwise': 0,

    // disallow use of the continue statement
    'no-continue': 0,

    // disallow comments inline after code
    'no-inline-comments': 0,

    // disallow if as the only statement in an else block
    'no-lonely-if': 0,

    // TODO: Figure out why this errors out even though
    // it's documented
    // disallow un-paren'd mixes of different operators
    // http://eslint.org/docs/rules/no-mixed-operators
    // 'no-mixed-operators': [2, {
    //   groups: [
    //     ['+', '-', '*', '/', '%', '**'],
    //     ['&', '|', '^', '~', '<<', '>>', '>>>'],
    //     ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
    //     ['&&', '||'],
    //     ['in', 'instanceof']
    //   ],
    //   allowSamePrecedence: false
    // }],

    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 2,

    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1 }],

    // disallow negated conditions
    // http://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 0,

    // TODO: Fix use of this in the app. Just don't have the brain power
    // currently.
    // disallow nested ternary expressions
    // 'no-nested-ternary': 2,

    // disallow use of the Object constructor
    'no-new-object': 2,

    // disallow use of unary operators, ++ and --
    'no-plusplus': 0,

    // disallow certain syntax forms
    // http://eslint.org/docs/rules/no-restricted-syntax
    'no-restricted-syntax': [
      2,
      'DebuggerStatement',
      'LabeledStatement',
      'WithStatement',
    ],

    // disallow space between function identifier and application
    'no-spaced-func': 2,

    // disallow the use of ternary operators
    'no-ternary': 0,

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 2,

    // TODO: Figure out how to get this enabled (renaming some things perhaps)
    // The the default here is to not allow it, but it's necessary for
    // overriding via this._super(..arguments), so...
    // disallow dangling underscores in identifiers
    // 'no-underscore-dangle': [2, { allowAfterThis: true }],

    // disallow the use of Boolean literals in conditional expressions
    // also, prefer `a || b` over `a ? a : b`
    // http://eslint.org/docs/rules/no-unneeded-ternary
    'no-unneeded-ternary': [2, { defaultAssignment: false }],

    // disallow whitespace before properties
    // http://eslint.org/docs/rules/no-whitespace-before-property
    'no-whitespace-before-property': 2,

    // require padding inside curly braces
    'object-curly-spacing': [2, 'always'],

    // enforce line breaks between braces
    // http://eslint.org/docs/rules/object-curly-newline
    // TODO: enable once https://github.com/eslint/eslint/issues/6488 is resolved
    'object-curly-newline': [0, {
      ObjectExpression: { minProperties: 0, multiline: true },
      ObjectPattern: { minProperties: 0, multiline: true }
    }],

    // TODO: Rule not found
    // enforce "same line" or "multiple line" on object properties.
    // http://eslint.org/docs/rules/object-property-newline
    // 'object-property-newline': [2, {
    //   allowMultiplePropertiesPerLine: true,
    // }],

    // TODO: Consider re-enabling later
    // allow just one var statement per function
    // 'one-var': [2, 'never'],

    // TODO: Re-evaluate including this once we've cleaned up some of the
    // biolerplate around Coffee -> JS conversion that created a *ton* of vars
    // require a newline around variable declaration
    // http://eslint.org/docs/rules/one-var-declaration-per-line
    // 'one-var-declaration-per-line': [2, 'always'],

    // require assignment operator shorthand where possible or prohibit it entirely
    'operator-assignment': 0,

    // enforce operators to be placed before or after line breaks
    'operator-linebreak': 0,

    // enforce padding within blocks
    'padded-blocks': [2, 'never'],

    // TODO: Wait on enforcing this until we figure out a way to handle AJAX
    // Headers in a sane way. We should use unquoted always unless numbers,
    // keywords *or constants* (or things that look like them).
    // require quotes around object literal property names
    // http://eslint.org/docs/rules/quote-props.html
    // 'quote-props': [2, 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

    // specify whether double or single quotes should be used
    quotes: [2, 'single', { avoidEscape: true }],

    // do not require jsdoc
    // http://eslint.org/docs/rules/require-jsdoc
    'require-jsdoc': 0,

    // require or disallow use of semicolons instead of ASI
    semi: [2, 'always'],

    // enforce spacing before and after semicolons
    'semi-spacing': [2, { before: false, after: true }],

    // sort variables within the same declaration block
    'sort-vars': 0,

    // require or disallow space before blocks
    'space-before-blocks': 2,

    // require or disallow space before function opening parenthesis
    // http://eslint.org/docs/rules/space-before-function-paren
    'space-before-function-paren': [2, { anonymous: 'always', named: 'never' }],

    // require or disallow spaces inside parentheses
    'space-in-parens': [2, 'never'],

    // require spaces around operators
    'space-infix-ops': 2,

    // Require or disallow spaces before/after unary operators
    'space-unary-ops': 0,

    // require or disallow a space immediately following the // or /* in a comment
    'spaced-comment': [2, 'always', {
      exceptions: ['-', '+'],
      markers: ['=', '!']           // space here to support sprockets directives
    }],

    // require or disallow the Unicode Byte Order Mark
    // http://eslint.org/docs/rules/unicode-bom
    'unicode-bom': [2, 'never'],

    // require regex literals to be wrapped in parentheses
    'wrap-regex': 0,

    // enforces no braces where they can be omitted
    // http://eslint.org/docs/rules/arrow-body-style
    'arrow-body-style': [2, 'as-needed'],

    // require parens in arrow function arguments
    'arrow-parens': 0,

    // require space before/after arrow function's arrow
    // http://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': [2, { before: true, after: true }],

    // verify super() callings in constructors
    'constructor-super': 0,

    // enforce the spacing around the * in generator functions
    // http://eslint.org/docs/rules/generator-star-spacing
    'generator-star-spacing': [2, { before: false, after: true }],

    // disallow modifying variables of class declarations
    // http://eslint.org/docs/rules/no-class-assign
    'no-class-assign': 2,

    // disallow arrow functions where they could be confused with comparisons
    // http://eslint.org/docs/rules/no-confusing-arrow
    'no-confusing-arrow': [2, {
      allowParens: true,
    }],

    // disallow modifying variables that are declared using const
    'no-const-assign': 2,

    // disallow duplicate class members
    // http://eslint.org/docs/rules/no-dupe-class-members
    'no-dupe-class-members': 2,

    // disallow importing from the same path more than once
    // http://eslint.org/docs/rules/no-duplicate-imports
    'no-duplicate-imports': 2,

    // disallow symbol constructor
    // http://eslint.org/docs/rules/no-new-symbol
    'no-new-symbol': 2,

    // disallow specific imports
    // http://eslint.org/docs/rules/no-restricted-imports
    'no-restricted-imports': 0,

    // disallow to use this/super before super() calling in constructors.
    // http://eslint.org/docs/rules/no-this-before-super
    'no-this-before-super': 2,

    // disallow useless computed property keys
    // http://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': 2,

    // disallow unnecessary constructor
    // http://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': 2,

    // disallow renaming import, export, and destructured assignments to the same name
    // http://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': [2, {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    }],

    // require let or const instead of var
    'no-var': 2,

    // TODO: ESLint complains about current config
    // require method and property shorthand syntax for object literals
    // http://eslint.org/docs/rules/object-shorthand
    // 'object-shorthand': [2, 'always', {
    //   ignoreConstructors: false,
    //   avoidQuotes: true,
    // }],

    // suggest using arrow functions as callbacks
    'prefer-arrow-callback': [2, {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    }],

    // TODO: ESLint complains about current config
    // suggest using of const declaration for variables that are never modified after declared
    // 'prefer-const': [2, {
    //   destructuring: 'any',
    //   ignoreReadBeforeAssign: true,
    // }],

    // suggest using Reflect methods where applicable
    // http://eslint.org/docs/rules/prefer-reflect
    // TODO: enable
    'prefer-reflect': 0,

    // TODO: Figure out how to incorporate this with Ember's encouraged use of
    // this._super(...arguments);
    // use rest parameters instead of arguments
    // http://eslint.org/docs/rules/prefer-rest-params
    // 'prefer-rest-params': 2,

    // suggest using the spread operator instead of .apply()
    // http://eslint.org/docs/rules/prefer-spread
    'prefer-spread': 0,

    // suggest using template literals instead of string concatenation
    // http://eslint.org/docs/rules/prefer-template
    'prefer-template': 2,

    // disallow generator functions that do not have yield
    // http://eslint.org/docs/rules/require-yield
    'require-yield': 2,

    // enforce spacing between object rest-spread
    // http://eslint.org/docs/rules/rest-spread-spacing
    'rest-spread-spacing': [2, 'never'],

    // import sorting
    // http://eslint.org/docs/rules/sort-imports
    'sort-imports': 0,

    // enforce usage of spacing in template strings
    // http://eslint.org/docs/rules/template-curly-spacing
    'template-curly-spacing': 2,

    // enforce spacing around the * in yield* expressions
    // http://eslint.org/docs/rules/yield-star-spacing
    'yield-star-spacing': [2, 'after']
  },
  globals: {
  }
};
