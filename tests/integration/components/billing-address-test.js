import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-address', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders an entire address', async function (assert) {
    this.set('billingInfo', {
      firstName: 'A',
      lastName: 'B',
      company: 'Company',
      address: 'Address',
      address2: 'Address 2',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      country: 'Country'
    });

    await render(hbs`{{billing-address billingInfo=billingInfo}}`);

    assert.deepEqual(Array.from(this.element.querySelectorAll('p')).map(e => e.textContent), [
      'A B',
      'Company',
      'Address',
      'Address 2',
      'City, State Zip Code',
      'Country'
    ]);
  });

  test('it renders an address with some absent components', async function (assert) {
    this.set('billingInfo', {
      firstName: 'A',
      lastName: 'B',
      address: 'Address',
      city: 'City',
      zipCode: 'Zip Code',
      country: 'Country'
    });

    await render(hbs`{{billing-address billingInfo=billingInfo}}`);

    assert.deepEqual(Array.from(this.element.querySelectorAll('p')).map(e => e.textContent), [
      'A B',
      'Address',
      'City Zip Code',
      'Country'
    ]);
  });
});
