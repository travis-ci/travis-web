import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | selected-billing-plan', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

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
    this.set('selectedPlan', plan1);

    await render(hbs`<SelectedBillingPlan 
      @showAnnual={{false}} 
      @selectedPlan={{selectedPlan}} 
      @goToFirstStep={{action 'goToFirstStep'}}/>`);

    assert.dom('[data-test-selected-plan-price]').hasTextContaining('$200 /month');
  });
});
