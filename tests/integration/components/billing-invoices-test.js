import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | billing-invoices', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {

    const user = server.create('user', {
      name: 'User Name of exceeding length',
      type: 'user',
      login: 'user-login',
      github_id: 1974,
      avatar_url: '/images/tiny.gif',
      permissions: {
        createSubscription: true
      }
    });

    const plan = server.create('plan', {
      name: 'Small Business Plan',
      builds: 5,
      annual: false,
      currency: 'USD',
      price: 6900
    });

    const subscription = server.create('subscription', {
      plan,
      owner: user,
      status: 'subscribed',
      valid_to: new Date(2018, 5, 19),
      source: 'stripe',
      permissions: {
        write: true
      }
    });

    subscription.createCreditCardInfo({
      lastDigits: '1919'
    });

    const invoices = [{
      id: '1919',
      createdAt: new Date(1919, 4, 15),
      url: 'https://example.com/1919.pdf'
    }, {
      id: '20102',
      createdAt: new Date(2010, 2, 14),
      url: 'https://example.com/20102.pdf'
    }, {
      id: '2010',
      createdAt: new Date(2010, 1, 14),
      url: 'https://example.com/2010.pdf'
    }];

    this.setProperties({ subscription, invoices });
  });

  test('renders billing invoices correctly', async function (assert) {

    await render(hbs`{{billing-invoices 
      invoices=invoices
      subscription=subscription
    }}`);

    assert.dom('h2').hasText('Invoice History');
    assert.dom('[data-test-help-text]').containsText('Having trouble with your invoices?');
    assert.dom('[data-test-help-text] a').containsText('We’re happy to help');
    assert.dom('[data-test-table-header-row] th').exists({ count: 4 });

    assert.equal(profilePage.billing.invoices.invoiceTableHeaders.length, 4);

    assert.equal(profilePage.billing.invoices.invoiceTableHeaders[0].text, 'invoice date');
    assert.equal(profilePage.billing.invoices.invoiceTableHeaders[1].text, 'payment card');
    assert.equal(profilePage.billing.invoices.invoiceTableHeaders[2].text, 'total');
    assert.equal(profilePage.billing.invoices.invoiceTableHeaders[3].text, 'download');

    profilePage.billing.invoices.items[0].as(march2010 => {
      assert.equal(march2010.invoiceUrl.href, 'https://example.com/20102.pdf');
      assert.equal(march2010.invoiceDate, 'March 14, 2010');
      assert.equal(march2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(march2010.invoiceCardPrice, '$69');
    });

    profilePage.billing.invoices.items[1].as(february2010 => {
      assert.equal(february2010.invoiceUrl.href, 'https://example.com/2010.pdf');
      assert.equal(february2010.invoiceDate, 'February 14, 2010');
      assert.equal(february2010.invoiceCardDigits, '•••• •••• •••• 1919');
      assert.equal(february2010.invoiceCardPrice, '$69');
    });
  });
});
