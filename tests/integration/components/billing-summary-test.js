import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import profilePage from 'travis/tests/pages/profile';
import moment from 'moment';

module('Integration | Component | billing-summary', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    const plan = {
      id: 1,
      name: 'A',
      builds: 5,
      amount: 20000,
      annual: false
    };

    const owner = {};

    const subscription = {
      validTo: new Date(2018, 5, 19),
      status: 'subscribed',
      isSubscribed: true,
      owner,
      plan,
    };

    const account = {
      hasSubscriptionPermissions: true
    };

    this.price = 129;
    this.subscription = subscription;
    this.planMessage = 'Valid until';

    this.setProperties({
      subscription,
      account,
      price: this.price,
      planMessage: this.planMessage
    });
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    const date = moment(this.subscription.validTo.getTime()).format('MMMM D, YYYY');

    await render(hbs`<BillingSummary 
      @subscription={{subscription}}
      @account={{account}}
      @price={{price}}
      @planMessage={{planMessage}}
    />`);

    assert.dom('h3').hasText('Overview');
    assert.equal(profilePage.billing.plan.name, 'A plan active');
    assert.dom(profilePage.billing.plan.concurrency.scope).hasTextContaining(`5 concurrent jobs Valid until ${date}`);
    assert.equal(profilePage.billing.planMessage.text, `Valid until ${date}`);
  });
});
