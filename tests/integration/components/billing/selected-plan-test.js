import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | selected-billing-plan', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    this['actions'] = {
      goToFirstStep: () => { }
    };

    const plan1 = {
      id: 1,
      name: 'Startup',
      starting_price: 3000,
      starting_users: 10
    };
    this.plan1 = plan1;
    this.set('selectedPlan', plan1);

    await render(hbs`<Billing::SelectedPlan
      @selectedPlan={{selectedPlan}}
      @goToFirstStep={{action 'goToFirstStep'}}/>`);

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.plan1.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.plan1.starting_users} unique users Charged monthly per usage - check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.plan1.starting_price / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');
  });
});
