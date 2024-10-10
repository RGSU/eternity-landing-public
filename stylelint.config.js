export default {
  extends: [
    // add more generic rulesets here, such as:
    // "stylelint-config-standard",
    'stylelint-config-rational-order',
    'stylelint-stylus/standard',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
  ],
  rules: {
    // override/add rules settings here, such as:
    // "stylus/indentation": 2,
    'stylus/number-leading-zero': 'never',
    'stylus/no-eol-whitespace': null,
    'order/properties-order': [],
    'plugin/rational-order': [true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': false,
      },
    ],
  },
};
