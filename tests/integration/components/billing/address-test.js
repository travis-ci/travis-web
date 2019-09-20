import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';

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
    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);

    assert.dom('[data-test-user-details] section:nth-child(1)').hasText('contact name A B');
    assert.dom('[data-test-user-details] section:nth-child(2)').hasText('company name Company');
    assert.dom('[data-test-user-details] section:nth-child(3)').hasText('billing email a@b.com');
    assert.dom('[data-test-billing-details] section:nth-child(1)').hasText('address Address');
    assert.dom('[data-test-billing-details] section:nth-child(2)').hasText('city City');
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);

    assert.dom('[data-test-user-details] section:nth-child(1)').hasText('contact name A B');
    assert.dom('[data-test-billing-details] section:nth-child(1)').hasText('address Address');
    assert.dom('[data-test-billing-details] section:nth-child(2)').hasText('city City');
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);

    assert.dom('[data-test-user-details]').doesNotExist();
    assert.dom('[data-test-billing-details]').doesNotExist();
  });

  test('it renders edit contact information form', async function (assert) {
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);
    await profilePage.billing.editContactAddressButton.click();

    assert.ok(profilePage.billing.editContactAddressForm.isPresent);
    assert.dom('[data-test-user-details]').doesNotExist();
  });

  test('it closes edit contact form when canceled', async function (assert) {
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);
    await profilePage.billing.editContactAddressButton.click();

    assert.ok(profilePage.billing.editContactAddressForm.isPresent);

    await profilePage.billing.editContactAddressForm.cancelContactAddressButton.click();

    assert.notOk(profilePage.billing.editContactAddressForm.isPresent);
    assert.dom('[data-test-user-details] section:nth-child(1)').hasText('contact name A B');
  });

  test('it renders edit billing information form', async function (assert) {
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);

    await profilePage.billing.editBillingAddressButton.click();

    assert.ok(profilePage.billing.editBillingAddressForm.isPresent);
    assert.dom('[data-test-billing-details]').doesNotExist();
  });

  test('it closes edit billing form when canceled', async function (assert) {
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

    this.set('account', {
      hasSubscriptionPermissions: true
    });

    await render(hbs`<Billing::Address @account={{account}} @subscription={{subscription}}/>`);

    await profilePage.billing.editBillingAddressButton.click();

    assert.ok(profilePage.billing.editBillingAddressForm.isPresent);

    await profilePage.billing.editBillingAddressForm.cancelBillingAddressButton.click();

    assert.notOk(profilePage.billing.editBillingAddressForm.isPresent);
    assert.dom('[data-test-billing-details] section:nth-child(1)').hasText('address Address');
    assert.dom('[data-test-billing-details] section:nth-child(2)').hasText('city City');
    assert.dom('[data-test-billing-details] section:nth-child(3)').hasText('post code Zip Code');
    assert.dom('[data-test-billing-details] section:nth-child(4)').hasText('country Country');
  });
});
