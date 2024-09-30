import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | selected-billing-plan', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this['actions'] = {
      goToFirstStep: () => { }
    };

    const plan1 = {
      id: 1,
      name: 'Startup',
      startingPrice: 3000,
      startingUsers: 10,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
    };
    this.plan1 = plan1;
    this.set('selectedPlan', plan1);

    await render(hbs`<Billing::SelectedPlan
      @selectedPlan={{this.selectedPlan}}
      @totalPrice={{this.selectedPlan.startingPrice}}
      @goToFirstStep={{action 'goToFirstStep'}}/>`);

    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.plan1.name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `User licenses incl. in price: User licenses at discounted credits price: check pricing Users charged monthly per usage: check pricing Up to ${this.plan1.startingUsers} unique users Charged monthly per usage - check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.plan1.startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');
  });
});
