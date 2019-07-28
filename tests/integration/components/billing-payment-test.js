import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubConfig } from 'travis/tests/helpers/stub-service';
import { getContext } from '@ember/test-helpers';

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


    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripev3', 'config', 'config:stripe');
  });

  test('billing-payment renders correctly', async function (assert) {

    await render(hbs`<BillingPayment 
      @paymentInfo={{paymentInfo}}
      @cancel={{action 'cancel'}}
      @selectedPlan={{selectedPlan}}/>`);

    assert.dom('h2').hasText('Credit card details');
  });
});
