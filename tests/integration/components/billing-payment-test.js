import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-payment', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {

    const selectedPlan = {
      id: 1,
      name: 'A',
      builds: 5,
      amount: 20000,
      annual: false
    };

    const paymentInfo = {
      cardNumber: null,
      cardName: '',
      expiryDateMonth: '',
      expiryDateYear: '',
      cvc: '',
      discountCode: ''
    };

    this['actions'] = {
      cancel: () => { }
    };

    this.setProperties({
      selectedPlan,
      paymentInfo
    });
  });

  test('billing-payment renders correctly', async function (assert) {

    await render(hbs`{{billing-payment 
      paymentInfo=paymentInfo 
      cancel=(action 'cancel')
      selectedPlan=selectedPlan}}`);

    assert.dom(profilePage.billing.billingPaymentForm.paymentInfo.scope)
      .containsText('Your credit card details are never stored or even reach our servers. Payment and credit card details are handled by Stripe.');
    assert.dom('h2').hasText('Credit card details');
  });
});
