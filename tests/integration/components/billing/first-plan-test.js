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

    const plan3 = {
      id: 'monthly_usage_plan_35k_credits',
      name: 'Monthly 35K Plan',
      startingPrice: 3000,
      startingUsers: 100,
      privateCredits: 35000,
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

    const account = {
      hasSubscriptionPermissions: true,
      eligibleV2Plans: [plan1, plan2, plan3],
      trialAllowed: true,
    };

    this.plan1 = plan1;
    this.plan2 = plan2;
    this.plan3 = plan3;

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

    let mockStorage = Service.extend({
      selectedPlanId: plan3.id
    });

    stubService('stripev3', mockStripe);

    stubService('accounts', mockAccounts);

    stubService('storage', mockStorage);
  });


  test('it renders selected trial', async function (assert) {
    await render(hbs`<Billing::FirstPlan
      @user={{this.account}}
    />`);
    assert.equal(firstPlan.selectedPlan.name, this.plan3.name);
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

  test('The plan should be selected by selectedPlanId if it exists in storage and is valid', async function (assert) {
    let component = this.owner.lookup('component:billing/first-plan');
    component.set('account', { trialAllowed: false, eligibleV2Plans: [this.plan1, this.plan2, this.plan3] });

    let selectedPlan = component.get('selectedPlan');

    assert.equal(selectedPlan.id, this.plan3.id, 'plan should be selected based on the selectedPlanId from storage');
  });

  test('The plan should be selected by defaultPlanId if the selectedPlanId doesn\'t exist or is invalid', async function (assert) {
    let component = this.owner.lookup('component:billing/first-plan');
    component.set('account', { trialAllowed: false, eligibleV2Plans: [this.plan1, this.plan2] });
    component.set('storage.selectedPlanId', 'invalid_plan');
    component.set('defaultPlanId', this.plan2.id);

    let selectedPlan = component.get('selectedPlan');

    assert.equal(selectedPlan.id, this.plan2.id, 'plan should be selected based on the defaultPlanId config');
  });

  test('The first plan in the list should be selected when nor selectedPlanId is valid neither defaultPlanId', async function (assert) {
    let component = this.owner.lookup('component:billing/first-plan');
    component.set('account', { trialAllowed: false, eligibleV2Plans: [this.plan1, this.plan2] });
    component.set('storage.selectedPlanId', 'invalid_plan');
    component.set('defaultPlanId', undefined);

    let selectedPlan = component.get('selectedPlan');

    assert.equal(selectedPlan.id, this.plan1.id, 'the first plan in the list should be selected');
  });
});
