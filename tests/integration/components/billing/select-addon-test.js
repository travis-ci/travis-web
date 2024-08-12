import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import profilePage from 'travis/tests/pages/profile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | billing-select-addon', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this['actions'] = {
      next: () => { }
    };

    const addon1 = {
      id: 'credits_25k',
      name: '25 000 credits (2,5k Linux build minutes)',
      price: 1500,
      quantity: 25000,
      type: 'credit_private'
    };
    this.addon1 = addon1;

    const addon2 = {
      id: 'credits_500k',
      name: '500 000 credits (50k Linux build minutes)',
      price: 30000,
      quantity: 500000,
      type: 'credit_private'
    };
    this.addon2 = addon2;

    this.setProperties({
      displayedStandaloneAddons: [addon1, addon2],
      selectedAddon: addon1
    });
  });

  test('it renders selected addon', async function (assert) {
    await render(hbs`<Billing::SelectAddon
      @displayedStandaloneAddons={{this.displayedStandaloneAddons}}
      @selectedAddon={{this.selectedAddon}}
      @showAddonsSelector={{true}}
      @next={{action 'next'}}/>`
    );

    assert.equal(profilePage.billing.selectedAddon.name.text, 'Additional credits');
    assert.equal(profilePage.billing.selectedAddon.desc.text, `${(this.addon1.quantity.toLocaleString())} credits`);
    assert.equal(profilePage.billing.selectedAddon.price.text, `$${this.addon1.price / 100}`);
  });
});
