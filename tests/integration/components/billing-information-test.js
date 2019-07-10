import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-information', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    const plans = [{
      id: 1,
      name: 'A',
      builds: 5,
      amount: 20000,
      annual: false
    }, {
      id: 1,
      name: 'B',
      builds: 10,
      amount: 30000,
      annual: true
    }];

    const billingInfo = {
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
    };

    this['actions'] = {
      next: () => { },
    };

    this.setProperties({
      displayedPlans: plans,
      selectedPlan: plans[0],
      showAnnual: false,
      billingInfo
    });
  });

  test('it renders billing information form correctly', async function (assert) {

    await render(hbs`
    {{billing-information 
      selectedPlan=selectedPlan 
      displayedPlans=displayedPlans 
      showAnnual=showAnnual
      next=(action 'next')
    }}`);

    assert.dom('[data-test-billing-info-title]').hasText('Billing Cycle');
  });
});
