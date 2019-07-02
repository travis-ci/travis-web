import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-select-plan', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const plan1 = {
      id: 1,
      name: 'Startup',
      builds: 5,
      price: 20000,
      annual: false
    };
    const plan2 = {
      id: 2,
      name: 'Premium',
      builds: 10,
      price: 30000,
      annual: true
    };
    this.setProperties({
      displayedPlans: [plan1, plan2],
      selectedPlan: plan1,
    });
  });

  test('it renders default selected plan', async function (assert) {

    await render(hbs`{{billing-select-plan displayedPlans=displayedPlans}}`);
    assert.equal(this.element.querySelector('.billing-plans__box--name').textContent.trim(), 'Startup');
    assert.equal(this.element.querySelector('.billing-plans__box--jobs').textContent.trim(), '5 concurrent jobs');
  });

  test('it hightlights default selected plan', async function (assert) {

    await render(hbs`{{billing-select-plan displayedPlans=displayedPlans selectedPlan=selectedPlan}}`);

    assert.equal(this.element.querySelectorAll('.billing-plans__box.highlight-plan').length, 1);
    assert.equal(this.element.querySelector('.selected-plan__details--name').textContent.trim(), 'Startup plan');
  });

  test('changing selected plan should highlight new plan', async function (assert) {

    await render(hbs`{{billing-select-plan displayedPlans=displayedPlans selectedPlan=selectedPlan}}`);

    this.set('selectedPlan', {
      id: 2,
      name: 'Premium',
      builds: 10,
      price: 30000,
      annual: false
    });

    assert.equal(this.element.querySelector('.selected-plan__details--name').textContent.trim(), 'Premium plan');
  });
});
