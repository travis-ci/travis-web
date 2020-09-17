import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | selected-addon', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    this['actions'] = {
      goToFirstStep: () => { }
    };

    const addonConfig = {
      id: 'credits_500k',
      name: '500 000 credits (50k Linux build minutes)',
      price: 30000,
      quantity: 500000,
      type: 'credit_private'
    };

    this.set('selectedAddon', addonConfig);

    await render(hbs`<Billing::SelectedAddon
      @selectedAddon={{selectedAddon}}
      @goToFirstStep={{action 'goToFirstStep'}}/>`);

    assert.equal(profilePage.billing.selectedAddonOverview.name.text, this.selectedAddon.name);
    assert.equal(profilePage.billing.selectedAddonOverview.price.text, `$${this.selectedAddon.price / 100}`);
    assert.equal(profilePage.billing.selectedAddonOverview.changeAddon.text, 'Change addon');
  });
});
