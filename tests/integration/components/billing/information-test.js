import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';
import {
  EPS_TRIGGER,
  BILLING_INFO_ADD_EMAIL,
  BILLING_INFO_EMAIL_INPUT
} from 'travis/tests/helpers/selectors';

module('Integration | Component | billing-information', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    const plans = [{
      id: 1,
      name: 'A',
      startingUsers: 5,
      startingPrice: 20000,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
    }, {
      id: 2,
      name: 'B',
      startingUsers: 10,
      startingPrice: 30000,
      hasCreditAddons: true,
      hasOSSCreditAddons: true,
      hasUserLicenseAddons: true,
    }];
    this.plans = plans;

    const subscription = {
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
      },
      plan: this.plans[0]
    };

    this['actions'] = {
      next: () => { },
      back: () => { },
      goToFirstStep: () => { }
    };

    this.setProperties({
      displayedPlans: plans,
      subscription,
      selectedPlan: plans[0]
    });
  });

  test('it renders billing information form correctly', async function (assert) {
    await render(hbs`
      <Billing::Information
        @displayedPlans={{displayedPlans}}
        @subscription={{subscription}}
        @selectedPlan={{selectedPlan}}
        @next={{action 'next'}}
        @back={{action 'back'}}
        @goToFirstStep={{action 'goToFirstStep'}}
      />`
    );

    assert.dom('[data-test-contact-details-title]').hasText('Contact details');
    assert.dom('[data-test-billing-details-title]').hasText('Billing address');
    assert.equal(profilePage.billing.selectedPlanOverview.name.text, `${this.plans[0].name}`);
    assert.equal(profilePage.billing.selectedPlanOverview.users.text, `Up to ${this.plans[0].startingUsers} unique users Charged monthly per usage - check pricing`);
    assert.equal(profilePage.billing.selectedPlanOverview.price.text, `$${this.plans[0].startingPrice / 100}`);
    assert.equal(profilePage.billing.selectedPlanOverview.changePlan.text, 'Change plan');

    assert.dom('input').isVisible({ count: 7 });
    assert.dom(EPS_TRIGGER).isVisible({ count: 1 });
  });

  test('it renders billing information form correctly', async function (assert) {
    assert.expect(1);

    this['actions']['back'] = () => {
      assert.ok(true);
    };

    await render(hbs`
      <Billing::Information
        @selectedPlan={{selectedPlan}}
        @displayedPlans={{displayedPlans}}
        @showAnnual={{showAnnual}}
        @selectedPlan={{this.selectedPlan}}
        @next={{action 'next'}}
        @back={{action 'back'}}
        @goToFirstStep={{action 'goToFirstStep'}}
      />`
    );

    await profilePage.billing.billingForm.backToPlans.click();
  });

  test('it adds multiple email inputs to form', async function (assert) {
    await render(hbs`
      <Billing::Information
        @displayedPlans={{displayedPlans}}
        @showAnnual={{showAnnual}}
        @selectedPlan={{this.selectedPlan}}
        @next={{action 'next'}}
        @back={{action 'back'}}
        @goToFirstStep={{action 'goToFirstStep'}}
      />`
    );

    await click(BILLING_INFO_ADD_EMAIL);
    await click(BILLING_INFO_ADD_EMAIL);
    await click(BILLING_INFO_ADD_EMAIL);

    assert.dom(BILLING_INFO_EMAIL_INPUT).isVisible({ count: 4 });
  });
});
