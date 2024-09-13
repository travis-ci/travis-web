import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import profilePage from 'travis/tests/pages/profile';
import moment from 'moment';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | billing-summary', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const plan = {
      id: 1,
      name: 'A',
      builds: 5,
      price: 12900,
      annual: false
    };

    const owner = {};

    const account = {
      hasSubscriptionPermissions: true
    };

    this.price = 12900;
    const subscription = {
      validTo: new Date(2018, 5, 19),
      status: 'subscribed',
      isSubscribed: true,
      isStripe: true,
      isCanceled: false,
      isExpired: false,
      isPending: false,
      isIncomplete: false,
      owner,
      plan,
    };
    this.subscription = subscription;
    this.planMessage = 'Valid until';

    this.setProperties({
      subscription,
      account,
      planMessage: this.planMessage
    });
  });

  test('it renders active subscription', async function (assert) {
    const date = moment(this.subscription.validTo.getTime()).format('MMMM D, YYYY');

    await render(hbs`<Billing::Summary
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.dom('h3').hasText('Plan information');
    assert.equal(profilePage.billing.plan.name, 'A plan active');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Valid until ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `Valid until ${date}`);
    assert.equal(profilePage.billing.price.text, '$129');
    assert.equal(profilePage.billing.period.text, '/month');
  });

  test('it renders canceled subscription', async function (assert) {
    const momentFromNow = moment(this.subscription.validTo.getTime()).fromNow();

    this.set('subscription', {
      ...this.subscription,
      status: 'canceled',
      isCanceled: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Expires');

    await render(hbs`<Billing::Summary
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.dom('h3').hasText('Plan information');
    assert.equal(profilePage.billing.plan.name, 'A plan canceled');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Expired on June 19, 2018`);
    assert.equal(profilePage.billing.planMessage.text, `Expired on June 19, 2018`);
    assert.equal(profilePage.billing.price.text, '$129');
    assert.equal(profilePage.billing.period.text, '/month');
  });

  test('it renders expired subscription', async function (assert) {
    const date = moment(this.subscription.validTo.getTime()).format('MMMM D, YYYY');

    this.set('subscription', {
      ...this.subscription,
      status: 'expired',
      isExpired: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Expired');

    await render(hbs`<Billing::Summary
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.dom('h3').hasText('Plan information');
    assert.equal(profilePage.billing.plan.name, 'A plan expired');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Expired on ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `Expired on ${date}`);
    assert.equal(profilePage.billing.price.text, '$129');
    assert.equal(profilePage.billing.period.text, '/month');
  });

  test('it renders pending subscription', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'pending',
      isPending: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Expired');

    await render(hbs`<Billing::Summary
      @subscription={{this.subscription}}
      @account={{this.account}}
      @isPendingOverride={{this.isPending}}
    />`);

    assert.dom('h3').hasText('Plan information');
    assert.equal(profilePage.billing.plan.name, 'A plan pending');
    assert.equal(profilePage.billing.price.text, '$129');
    assert.equal(profilePage.billing.period.text, '/month');
  });

  test('it renders incomplete subscription', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'incomplete',
      isIncomplete: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Incomplete');

    await render(hbs`<Billing::Summary
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.dom('h3').hasText('Plan information');
    assert.equal(profilePage.billing.plan.name, 'A plan incomplete');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining('5 concurrent jobs Incomplete');
    assert.equal(profilePage.billing.planMessage.text, 'Incomplete');
    assert.equal(profilePage.billing.price.text, '$129');
    assert.equal(profilePage.billing.period.text, '/month');
  });
});
