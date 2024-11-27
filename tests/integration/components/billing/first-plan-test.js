import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import firstPlan from 'travis/tests/pages/first-plan';
import { setupMirage } from 'ember-cli-mirage/test-support';

import Service from '@ember/service';
import { stubService } from 'travis/tests/helpers/stub-service';

module('Integration | Component | first-plan', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this['actions'] = {
      next: () => { }
    };

    const plan1 = {
      id: 'standard_tier_plan',
      name: 'Standard Tier Plan',
      startingPrice: 3000,
      startingUsers: 100,
      privateCredits: 25000,
      publicCredits: 40000,
      isFree: false,
      isAnnual: true,
      isUnlimitedUsers: false,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
      planType: 'hybrid annual',
      trialConfig: { duration: '16_d' },
      hasTrialPeriod: true,
      trialDuration: 16,
    };

    const plan2 = {
      id: 'pro_tier_plan',
      name: 'Pro Tier Plan',
      startingPrice: 30000,
      startingUsers: 10000,
      privateCredits: 500000,
      publicCredits: 40000,
      isFree: false,
      isAnnual: true,
      isUnlimitedUsers: false,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
      planType: 'hybrid annual',
    };

    const account = {
      hasSubscriptionPermissions: true,
      eligibleV2Plans: [plan1, plan2],
      trialAllowed: true,
    };

    this.plan1 = plan1;
    this.plan2 = plan2;

    let mockStripe = Service.extend({
      load() { },
      elements() {
        return {
          create: function () {
            return {
              mount: function () {},
              on: function () {},
              unmount: function () {},
            };
          },
        };
      },
      addStripeElement() {},
      removeStripeElement() {},
    });

    let mockAccounts = Service.extend({
      user: account
    });

    stubService('stripev3', mockStripe);

    stubService('accounts', mockAccounts);
  });


  test('it renders selected trial', async function (assert) {
    await render(hbs`<Billing::FirstPlan
      @user={{this.account}}
    />`);
    assert.equal(firstPlan.selectedPlan.name, this.plan1.name);
    assert.dom('[data-test-fp-selected-plan-trial]').exists();
    assert.equal(firstPlan.selectedPlan.trialText, 'Free Trial: 16 days');
    assert.dom('[data-test-fp-selected-plan-price]').containsText('after trial');
    assert.dom('.trial-no-charge-text').exists();
  });

  test('it shouldn\'t render trial if not allowed', async function (assert) {
    this.set('account', { trialAllowed: false, eligibleV2Plans: [this.plan2] });
    let mockAccounts = Service.extend({
      user: this.account
    });

    stubService('accounts', mockAccounts);
    await render(hbs`<Billing::FirstPlan
      @user={{this.account}}
    />`);
    assert.equal(firstPlan.selectedPlan.name, this.plan2.name);
    assert.dom('[data-test-fp-selected-plan-trial]').doesNotExist();
    assert.dom('[data-test-fp-selected-plan-price]').doesNotContainText('after trial');
    assert.dom('.trial-no-charge-text').doesNotExist();
  });
});
