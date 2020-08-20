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
      builds: 5,
      price: 20000,
      annual: false
    };
    this.plan1 = plan1;
    this.set('selectedPlan', plan1);

    await render(hbs`<Billing::SelectedPlan
      @showAnnual={{false}}
      @selectedPlan={{selectedPlan}}
      @goToFirstStep={{action 'goToFirstStep'}}/>`);

    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.plan1.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.plan1.builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.plan1.price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');
  });
});
