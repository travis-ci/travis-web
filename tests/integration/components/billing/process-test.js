import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import StripeMock from 'travis/tests/helpers/stripe-mock';
import { stubConfig, stubService } from 'travis/tests/helpers/stub-service';
import { getContext } from '@ember/test-helpers';
import Service from '@ember/service';

module('Integration | Component | billing-process', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {

    const plans = [{
      id: 1,
      name: 'A',
      builds: 5,
      price: 20000,
      annual: false
    }, {
      id: 1,
      name: 'B',
      builds: 10,
      price: 30000,
      annual: true
    }];

    this.plans = plans;

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
    const account = { id: 1, hasSubscriptionPermissions: true, type: 'Organization' };
    this.setProperties({
      account,
      plans,
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

    let mockAccounts = Service.extend({
      user: account
    });

    stubService('accounts', mockAccounts);
  });

  test('deny subscription when user has no permission', async function (assert) {

    this.set('currentStep', 'stepTwo');
    this.set('account', { hasSubscriptionPermissions: false });

    await render(hbs`
    <Billing::Process 
      @account={{account}}
    />`);

    assert.dom('p').hasText("You don't have permission to create a subscription");
  });
});
