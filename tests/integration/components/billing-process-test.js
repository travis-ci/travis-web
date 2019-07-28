import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubConfig } from 'travis/tests/helpers/stub-service';
import { getContext } from '@ember/test-helpers';

module('Integration | Component | billing-process', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {

    const plans = [{
      id: 1,
      name: 'A',
      builds: 5,
      amount: 20000,
      annual: false
    }, {
      id: 1,
      name: 'B',
      builds: 10,
      amount: 30000,
      annual: true
    }];

    const billingInfo = {
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
    };

    this.setProperties({
      account: { hasSubscriptionPermissions: true},
      plans: plans,
      selectedPlan: plans[0],
      showAnnual: false,
      billingInfo,
      steps: ['stepOne', 'stepTwo'],
    });

    window.Stripe = StripeMock;
    let config = {
      mock: true,
      publishableKey: 'mock'
    };
    stubConfig('stripe', config, { instantiate: false });
    const { owner } = getContext();
    owner.inject('service:stripe', 'config', 'config:stripe');
  });

  test('renders billing payment form correctly', async function (assert) {

    this.set('currentStep', 'stepTwo');

    await render(hbs`<BillingProcess 
      @account={{account}}
      @plans={{plans}}
      @currentStep={{currentStep}}
    />`);

    assert.dom('h2').hasText('Credit card details');
  });

  test('deny subscription when user has no permission', async function (assert) {

    this.set('currentStep', 'stepTwo');
    this.set('account', { hasSubscriptionPermissions: false});

    await render(hbs`
    <BillingProcess 
      @account={{account}}
      @plans={{plans}}
    />`);

    assert.dom('p').hasText('You do not have permission to create a subscription');
  });
});
