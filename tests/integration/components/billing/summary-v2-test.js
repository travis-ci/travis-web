import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import profilePage from 'travis/tests/pages/profile';
import moment from 'moment';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | billing-summary-v2', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const plan = {
      id: 1,
      name: 'A',
      price: 12900,
      annual: false,
      hasCreditAddons: true,
      get() { return ''; }
    };

    const owner = {
      get() {
        return {
          admin: {},
        };
      },
    };

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
      isNotManual: true,
      hasCredits: true,
      isTrial: false,
      owner,
      plan,
      get() { return ''; }
    };
    this.plan = plan;
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

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.equal(profilePage.billing.plan.name, `A active Valid until ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `Valid until ${date}`);
    assert.dom('.auto-refill').exists();
  });

  test('it renders active subscription with trial', async function (assert) {
    const date = moment(this.subscription.validTo.getTime()).format('MMMM D, YYYY');

    const owner = {
      get() {
        return {
          admin: {},
        };
      },
    };

    const subscription = {
      validTo: new Date(2018, 5, 19),
      status: 'subscribed',
      isSubscribed: true,
      isStripe: true,
      isCanceled: false,
      isExpired: false,
      isPending: false,
      isIncomplete: false,
      isNotManual: true,
      hasCredits: true,
      isTrial: false,
      current_trial: {
        status: 'subscribed',
      },
      owner,
      plan: this.plan,

      get() { return ''; }
    };
    this.subscription = subscription;

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.equal(profilePage.billing.plan.name, `A active (Free Trial Period) Valid until ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `(Free Trial Period) Valid until ${date}`);
    assert.dom('.auto-refill').doesNotExist();
  });

  test('it renders canceled subscription', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'canceled',
      isCanceled: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Expires');

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.equal(profilePage.billing.plan.name, 'A canceled Expired on June 19, 2018');
    assert.equal(profilePage.billing.planMessage.text, 'Expired on June 19, 2018');
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

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.equal(profilePage.billing.plan.name, `A expired Expired on ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `Expired on ${date}`);
  });

  test('it renders pending subscription', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'pending',
      isPending: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Expired');

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @isPendingOverride={{this.isPending}}
    />`);

    assert.equal(profilePage.billing.plan.name, 'A pending');
  });

  test('it renders incomplete subscription', async function (assert) {
    this.set('subscription', {
      ...this.subscription,
      status: 'incomplete',
      isIncomplete: true,
      isSubscribed: false,
    });
    this.set('planMessage', 'Incomplete');

    await render(hbs`<Billing::SummaryV2
      @subscription={{this.subscription}}
      @account={{this.account}}
      @planMessage={{this.planMessage}}
    />`);

    assert.equal(profilePage.billing.plan.name, 'A incomplete Incomplete');
    assert.equal(profilePage.billing.planMessage.text, 'Incomplete');
  });
});
