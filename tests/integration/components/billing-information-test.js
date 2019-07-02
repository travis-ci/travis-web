import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-information', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('plans', [{
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
    }]);
    this.set('showMonthly', true);
    this.set('account', { hasSubscriptionPermissions: true });

    await render(hbs`{{billing-information plans=plans account=account}}`);

    assert.equal(this.element.querySelector('h5').textContent.trim(), 'Recommendation:');
  });
});
