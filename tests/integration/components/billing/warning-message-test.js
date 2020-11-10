import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | warning-message', function (hooks) {
  setupRenderingTest(hooks);

  test('sameAddons', async function (assert) {

    const selectedPlan = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      addonConfigs: [
        {id: 'oss_tier_credits', name: 'Free 40 000 credits (renewed monthly)', price: 0, quantity: 40000, type: 'credit_public'},
        {id: 'free_tier_credits', name: 'Free 10 000 credits (renewed monthly)', price: 0, quantity: 10000, type: 'credit_private'}
      ]
    };

    this.set('selectedPlan', selectedPlan);

    const subscription = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      addonUsage: {
        private: {
          remainingCredits: 10
        },
      },
      addons: [
        {name: 'Free 40 000 credits (renewed monthly)', type: 'credit_public'},
        {name: 'Free 10 000 credits (renewed monthly)', type: 'credit_private'},
      ],
    };

    this.set('subscription', subscription);
    await render(hbs`<Billing::WarningMessage
      @selectedPlan={{selectedPlan}}
      @subscription={{subscription}}
      />`);


    assert.equal(profilePage.billing.warningMessage.text, 'You are switching to the Startup. Your remaining credits will be added to credits coming with Startup. Credits that will be added: Credits remaining balance: 10');
  });

  test('other addons', async function (assert) {

    const selectedPlan = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10
    };

    this.set('selectedPlan', selectedPlan);

    const subscription = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      addonUsage: {
        private: {
          remainingCredits: 10
        },
      },
      addons: [
        {name: 'Free 40 000 credits (renewed monthly)', type: 'credit_public'},
        {name: 'Free 10 000 credits (renewed monthly)', type: 'credit_private'},
      ],
    };

    this.set('subscription', subscription);
    await render(hbs`<Billing::WarningMessage
      @selectedPlan={{selectedPlan}}
      @subscription={{subscription}}
      />`);

    assert.equal(profilePage.billing.warningMessage.text, 'Pricing for number of users who are allowed to trigger builds may be changed. See our documentation for more details.');
  });

  test('negative ballance', async function (assert) {

    const selectedPlan = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      addonConfigs: [
        {id: '1', name: 'abc', price: 0, quantity: 40000, type: 'credit_public'},
        {id: '2', name: 'xyz', price: 0, quantity: 10000, type: 'credit_private'}
      ]
    };

    this.set('selectedPlan', selectedPlan);

    const subscription = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      addonUsage: {
        private: {
          remainingCredits: -10
        },
      },
      addons: [
        {name: 'Free 40 000 credits (renewed monthly)', type: 'credit_public'},
        {name: 'Free 10 000 credits (renewed monthly)', type: 'credit_private'},
      ],
    };

    this.subscription = subscription;
    this.set('subscription', subscription);
    await render(hbs`<Billing::WarningMessage
      @selectedPlan={{selectedPlan}}
      @subscription={{subscription}}
      />`);

    assert.equal(profilePage.billing.warningMessage.text, 'Your Private or OSS Credit balance is negative. After upgrading to the Startup plan the negative Credit amount will be deducted from the respective new credit type balance. Please see our documentation for more details.');
  });
});
