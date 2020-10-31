import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | billing-select-plan', function (hooks) {
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
      isUnlimitedUsers: false,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
    };
    this.plan1 = plan1;

    const plan2 = {
      id: 'pro_tier_plan',
      name: 'Pro Tier Plan',
      startingPrice: 30000,
      startingUsers: 10000,
      privateCredits: 500000,
      publicCredits: 40000,
      isFree: false,
      isUnlimitedUsers: false,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
    };
    this.plan2 = plan2;

    this.setProperties({
      displayedPlans: [plan1, plan2],
      selectedPlan: plan1,
    });
  });

  test('it renders default selected plan', async function (assert) {

    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{displayedPlans}}
      @selectedPlan={{selectedPlan}}
      @showPlansSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan1.name}`);
    assert.dom(profilePage.billing.selectedPlan.users.scope).hasText(`Up to ${this.plan1.startingUsers} unique users`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`Starting at $${this.plan1.startingPrice / 100}`);
  });

  test('changing selected plan should highlight new plan', async function (assert) {
    this.set('selectedPlan', this.plan2);

    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{displayedPlans}}
      @selectedPlan={{selectedPlan}}
      @showPlansSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan2.name}`);
    assert.dom(profilePage.billing.selectedPlan.users.scope).hasText(`Up to ${this.plan2.startingUsers} unique users`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`Starting at $${this.plan2.startingPrice / 100}`);
  });
});
