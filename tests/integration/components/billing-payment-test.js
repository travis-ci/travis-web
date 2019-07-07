import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
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
      back: () => { },
      cancel: () => { }
    };

    this.setProperties({
      selectedPlan,
      paymentInfo
    });
  });

  test('it renders', async function (assert) {

    await render(hbs`{{billing-payment 
      paymentInfo=paymentInfo 
      back=(action 'back')
      cancel=(action 'cancel')
      selectedPlan=selectedPlan}}`);

    assert.dom('h3').hasText('Credit card details');
  });
});
