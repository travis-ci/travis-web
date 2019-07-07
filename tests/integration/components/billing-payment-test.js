import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-payment', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
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
      back: () => { }
    };

    this.set('paymentInfo', paymentInfo);
    this.set('selectedPlan', selectedPlan);

    await render(hbs`{{billing-payment 
      paymentInfo=paymentInfo 
      back=(action 'back')
      selectedPlan=selectedPlan}}`);

    assert.dom('h3').hasText('Credit card details');
  });
});
