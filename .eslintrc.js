module.exports = {
  extends: [
    'airbnb-base',

    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
  ],

  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },

  env: {
    browser: true,
  },

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  rules: {

    'max-len': 0,

    'semi': ['error', 'never'],

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'currentState', // for vuex state
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],

    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],

    // disable dangling commas in functions since that seems to throw a parsing
    //  error
    'comma-dangle': ['error', 'always-multiline', { functions: 'never' }],

    // allow debugger during development
    'no-debugger': 'off',

  }
}
