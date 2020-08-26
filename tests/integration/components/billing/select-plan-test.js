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
      id: 1,
      name: 'Standard Tier Plan',
      starting_users: 5,
      starting_price: 20000
    };
    this.plan1 = plan1;

    const plan2 = {
      id: 2,
      name: 'Pro Tier Plan',
      starting_users: 10,
      starting_price: 30000
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
      @showMonthly={{this.showMonthly}}
      @showAnnual={{this.showAnnual}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan1.name}`);
    assert.dom(profilePage.billing.selectedPlan.users.scope).hasText(`Up to ${this.plan1.starting_users} unique users`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`Starting at $${this.plan1.starting_price / 100}`);
  });

  test('changing selected plan should highlight new plan', async function (assert) {
    this.set('selectedPlan', this.plan2);
    this.set('showAnnual', true);
    this.set('showMonthly', false);

    await render(hbs`<Billing::SelectPlan
      @displayedPlans={{displayedPlans}}
      @selectedPlan={{selectedPlan}}
      @showMonthly={{this.showMonthly}}
      @showAnnual={{this.showAnnual}}
      @next={{action 'next'}}/>`
    );

    assert.dom(profilePage.billing.selectedPlan.name.scope).hasText(`${this.plan2.name}`);
    assert.dom(profilePage.billing.selectedPlan.users.scope).hasText(`Up to ${this.plan2.starting_users} unique users`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`Starting at $${this.plan2.starting_price / 100}`);
  });
});
