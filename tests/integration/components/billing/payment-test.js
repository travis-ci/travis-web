import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubConfig } from 'travis/tests/helpers/stub-service';
import { getContext } from '@ember/test-helpers';
import profilePage from 'travis/tests/pages/profile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | billing-payment', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {

    const selectedPlan = {
      id: 1,
      name: 'A',
      builds: 5,
      price: 20000,
      annual: false
    };

    const creditCardInfo = {
      token: '',
      lastDigits: '4242'
    };

    const newSubscription = {
      billingInfo: {
        firstName: '',
        lastName: '',
        companyName: '',
        billingEmail: '',
        street: '',
        billingSuite: '',
        billingCity: '',
        bllingZip: '',
        country: '',
        vatId: ''
      },
      plan: selectedPlan,
      creditCardInfo: creditCardInfo
    };

    this['actions'] = {
      handleSubmit: () => { },
      goToFirstStep: () => { },
      back: () => { },
      cancel: () => { }
    };

    this.setProperties({
      selectedPlan,
      newSubscription
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

    await render(hbs`<Billing::Payment
      @subscription={{newSubscription}}
      @selectedPlan={{this.selectedPlan}}
      @cancel={{action 'cancel'}}
      @goToFirstStep={{action 'goToFirstStep'}}
      @back={{action 'back'}}
      @selectedPlan={{selectedPlan}}/>`);

    assert.dom('h3').hasText('Order Summary');
    assert.dom(profilePage.billing.billingPaymentForm.completePayment.scope).isVisible();
  });
});
