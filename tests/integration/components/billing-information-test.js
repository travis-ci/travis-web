import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';

module('Integration | Component | billing-information', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    const plans = [{
      id: 1,
      name: 'A',
      builds: 5,
      price: 20000,
      annual: false
    }, {
      id: 1,
      name: 'B',
      builds: 10,
      price: 30000,
      annual: true
    }];
    this.plans = plans;

    const newSubscription = {
      billingInfo: {
        firstName: '',
        lastName: '',
        companyName: '',
        billingEmail: '',
        street: '',
        billingSuite: '',
        billingCity: '',
        bllingZip: '',
        country: '',
        vatId: ''
      }
    };

    this['actions'] = {
      next: () => { },
      back: () => { },
      goToFirstStep: () => { }
    };

    this.setProperties({
      displayedPlans: plans,
      selectedPlan: plans[0],
      showAnnual: false,
      newSubscription
    });
  });

  test('it renders billing information form correctly', async function (assert) {
    await render(hbs`
      {{billing-information 
        selectedPlan=selectedPlan 
        displayedPlans=displayedPlans 
        showAnnual=showAnnual
        newSubscription=newSubscription
        next=(action 'next')
        back=(action 'back')
        goToFirstStep=(action 'goToFirstStep')
      }}`
    );

    assert.dom('[data-test-contact-details-title]').hasText('Contact details');
    assert.equal(profilePage.billing.selectedPlanOverview.heading.text, 'summary');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.plans[0].name} plan`);
    assert.equal(profilePage.billing.selectedPlanOverview.jobs.text, `${this.plans[0].builds} concurrent jobs`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.plans[0].price / 100}`);
    assert.equal(profilePage.billing.period.text, '/month');
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'change plan');

    assert.dom('input').isVisible({ count: 9 });
    assert.dom('.ember-power-select-trigger').isVisible({ count: 1 });
  });
});
