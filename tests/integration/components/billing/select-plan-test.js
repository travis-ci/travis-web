import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
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
      isAnnual: true,
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
      isAnnual: true,
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

  skip('it renders default selected plan', async function (assert) {
    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{this.displayedPlans}}
      @selectedPlanOverride={{this.selectedPlan}}
      @showPlansSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan1.name}`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`$${this.plan1.startingPrice / 100}/${this.plan1.isAnnual ? 'annualy' : 'monthly'}`);
  });

  skip('changing selected plan should highlight new plan', async function (assert) {
    this.set('selectedPlan', this.plan2);

    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{this.displayedPlans}}
      @selectedPlanOverride={{this.selectedPlan}}
      @showPlansSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan2.name}`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`$${this.plan2.startingPrice / 100}/${this.plan2.isAnnual ? 'annualy' : 'monthly'}`);
  });

  test('displayedPlans should filter availablePlans based on subscription.plan.startingPrice', async function(assert) {
    let availablePlans = [
      { name: 'Plan 1', startingPrice: 100 },
      { name: 'Plan 2', startingPrice: 200 },
      { name: 'Plan 3', startingPrice: 300 }
    ];
    let subscription = { plan: { startingPrice: 150 } };

    await render(hbs`<Billing::SelectPlan @next={{action 'next'}}/>`);

    let component = this.owner.lookup('component:billing/select-plan');
    component.set('availablePlans', availablePlans);
    component.set('subscription', subscription);

    // This is forcing the computed property to be calculated
    component.get('displayedPlans');
    let displayedPlans = component.get('displayedPlans');

    assert.ok(displayedPlans, 'displayedPlans should be defined');
    assert.equal(displayedPlans.length, 2);
    assert.equal(displayedPlans[0].name, 'Plan 2');
    assert.equal(displayedPlans[1].name, 'Plan 3');
  });
});
