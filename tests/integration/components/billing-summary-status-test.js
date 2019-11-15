import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';

module('Integration | Component | billing-summary-status', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.subscription = {
      isSubscribed: true,
      isExpired: false,
      isStripe: true,
      plan: {
        name: 'Bootstrap'
      }
    };
    this.isPending = false;
    this.setProperties({
      subscription: this.subscription,
      isPending: this.isPending
    });
  });

  test('it renders active status', async function (assert) {

    await render(hbs`<BillingSummaryStatus
      @subscription={{subscription}}
      @isPending={{isPending}}
    />`);

    assert.dom('[data-test-plan-name]').hasText('Bootstrap plan active');
    assert.dom(profilePage.billing.billingSubscription.activeStatus).hasText('active');
  });

  test('it renders expired status', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'expired',
      isExpired: true,
      isSubscribed: false,
    });

    await render(hbs`<BillingSummaryStatus
      @subscription={{subscription}}
      @isPending={{isPending}}
    />`);

    assert.dom('[data-test-plan-name]').hasText('Bootstrap plan expired');
    assert.dom(profilePage.billing.billingSubscription.expiredStatus).hasText('expired');
  });

  test('it renders incomplete status', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'incomplete',
      isIncomplete: true,
      isSubscribed: false,
    });

    await render(hbs`<BillingSummaryStatus
      @subscription={{subscription}}
      @isPending={{isPending}}
    />`);

    assert.dom('[data-test-plan-name]').hasText('Bootstrap plan incomplete');
    assert.dom(profilePage.billing.billingSubscription.greyStatus).hasText('incomplete');
  });

  test('it renders pending status', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'pending',
      isPending: true,
      isSubscribed: false,
    });

    await render(hbs`<BillingSummaryStatus
      @subscription={{subscription}}
      @isPending={{isPending}}
    />`);

    assert.dom('[data-test-plan-name]').hasText('Bootstrap plan pending');
    assert.dom(profilePage.billing.billingSubscription.greyStatus).hasText('pending');
  });

  test('it renders canceled status', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'canceled',
      isCanceled: true,
      isExpired: false,
      isPending: false,
      isSubscribed: false,
    });

    await render(hbs`<BillingSummaryStatus
      @subscription={{subscription}}
    />`);

    assert.dom('[data-test-plan-name]').hasText('Bootstrap plan canceled');
    assert.dom(profilePage.billing.billingSubscription.canceledStatus).hasText('canceled');
  });
});
