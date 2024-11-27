import {
  create,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('account_activation'),

  selectedPlan: {
    scope: '[data-test-fp-selected-plan]',
    exists: isVisible(),
    name: text('[data-test-fp-selected-plan-name]'),
    trialText: text('[data-test-fp-selected-plan-trial]'),
    priceText: text('[data-test-fp-selected-plan-price]'),
  },
});
