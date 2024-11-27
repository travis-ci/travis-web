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
      planType: 'hybrid annual',
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
      planType: 'hybrid annual',
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

  test('displayedPlans should filter availablePlans based on subscription.plan.startingPrice', function (assert) {
    let component = this.owner.lookup('component:billing/select-plan');
    let subscription = { plan: { name: 'Standard Tier Plan', startingPrice: 3000, trialPlan: false } };

    component.set('availablePlans', [this.plan1, this.plan2]);
    component.set('subscription', subscription);
    const referencePlan = component.get('availablePlans')
      .find(plan => plan.name === component.get('subscription').plan.name && plan.planType === 'hybrid annual');

    component.set('referencePlan', referencePlan);

    let displayedPlans = component.get('displayedPlans');

    assert.ok(displayedPlans, 'displayedPlans should be defined');
    assert.equal(displayedPlans.length, 2, 'displayedPlans should contain 2 plans');
    assert.deepEqual(displayedPlans, [this.plan1, this.plan2], 'displayedPlans should contain the correct plans');
  });

  test('displayedPlans should include current plan when trial period is active', function (assert) {
    let component = this.owner.lookup('component:billing/select-plan');
    let subscription = { plan: { name: 'Standard Tier Plan', startingPrice: 3000, trialPlan: false,
                                                        planType: 'hybrid annual' } ,
                                                current_trial: {status: 'subscribed'}
    };

    component.set('availablePlans', [this.plan1, this.plan2]);
    component.set('subscription', subscription);
    const referencePlan = component.get('availablePlans')
      .find(plan => plan.name === component.get('subscription').plan.name && plan.planType === 'hybrid annual');

    component.set('referencePlan', referencePlan);

    let displayedPlans = component.get('displayedPlans');

    assert.ok(displayedPlans, 'displayedPlans should be defined');
    assert.equal(displayedPlans.length, 3, 'displayedPlans should contain 3 plans');
    assert.deepEqual(displayedPlans, [subscription.plan, this.plan1, this.plan2], 'displayedPlans should contain the correct plans');
  });

  test('warning text should be present when trial period is active', async function (assert) {
    let subscription = { plan: { name: 'Standard Tier Plan', startingPrice: 3000, trialPlan: false,
                                                        planType: 'hybrid annual' } ,
                                                current_trial: {status: 'subscribed'}
    };
    component.set('subscription', subscription);

    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{this.displayedPlans}}
      @selectedPlanOverride={{this.selectedPlan}}
      @showPlansSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan).hasText('Selecting a plan will immediately end your current Free Trial Period');
  });
});
