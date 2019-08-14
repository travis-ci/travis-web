import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-address', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders an entire address', async function (assert) {
    this.set('subscription', {
      isStripe: true,
      billingInfo: {
        firstName: 'A',
        lastName: 'B',
        company: 'Company',
        address: 'Address',
        address2: 'Address 2',
        billingEmail: 'a@b.com',
        city: 'City',
        state: 'State',
        zipCode: 'Zip Code',
        country: 'Country'
      }
    });

    await render(hbs`{{billing-address subscription=subscription}}`);

    assert.dom('[data-test-user-details] section:nth-child(1)').hasText('contact name A B');
    assert.dom('[data-test-user-details] section:nth-child(2)').hasText('company name Company');
    assert.dom('[data-test-user-details] section:nth-child(3)').hasText('billing email a@b.com');
    assert.dom('[data-test-billing-details] section:nth-child(1)').hasText('address Address');
    assert.dom('[data-test-billing-details] section:nth-child(2)').hasText('city,state/territory City');
    assert.dom('[data-test-billing-details] section:nth-child(3)').hasText('post code Zip Code');
    assert.dom('[data-test-billing-details] section:nth-child(4)').hasText('country Country');
  });

  test('it renders an address with some absent components', async function (assert) {
    this.set('subscription', {
      isStripe: true,
      billingInfo: {
        firstName: 'A',
        lastName: 'B',
        address: 'Address',
        city: 'City',
        zipCode: 'Zip Code',
        country: 'Country'
      }
    });

    await render(hbs`{{billing-address subscription=subscription}}`);

    assert.dom('[data-test-user-details] section:nth-child(1)').hasText('contact name A B');
    assert.dom('[data-test-billing-details] section:nth-child(1)').hasText('address Address');
    assert.dom('[data-test-billing-details] section:nth-child(2)').hasText('city,state/territory City');
    assert.dom('[data-test-billing-details] section:nth-child(3)').hasText('post code Zip Code');
    assert.dom('[data-test-billing-details] section:nth-child(4)').hasText('country Country');
  });

  test('it renders nothing when not stripe payment', async function (assert) {
    this.set('subscription', {
      isStripe: false,
      billingInfo: {
        firstName: 'A',
        lastName: 'B',
        address: 'Address',
        city: 'City',
        zipCode: 'Zip Code',
        country: 'Country'
      }
    });

    await render(hbs`{{billing-address subscription=subscription}}`);

    assert.dom('[data-test-user-details]').doesNotExist();
    assert.dom('[data-test-billing-details]').doesNotExist();
  });
});
