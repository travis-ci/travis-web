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
      name: 'Startup',
      builds: 5,
      price: 20000,
      annual: false
    };
    this.plan1 = plan1;

    const plan2 = {
      id: 2,
      name: 'Premium',
      builds: 10,
      price: 30000,
      annual: true
    };
    this.plan2 = plan2;

    this.setProperties({
      displayedPlans: [plan1, plan2],
      selectedPlan: plan1,
      showMonthly: true,
      showAnnual: false
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
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasText(`${this.plan1.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`$${this.plan1.price / 100} /month`);
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
    assert.dom(profilePage.billing.selectedPlan.jobs.scope).hasText(`${this.plan2.builds} concurrent jobs`);
    assert.dom(profilePage.billing.selectedPlan.price.scope).hasText(`$${this.plan2.price / 100} /year`);
  });
});
