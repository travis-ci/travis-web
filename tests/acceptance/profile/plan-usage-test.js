import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | profile/plan usage', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.user = this.server.create('user', {
      name: 'User Name of exceeding length',
      type: 'user',
      login: 'user-login',
      github_id: 1974,
      avatar_url: '/images/tiny.gif',
      permissions: {
        createSubscription: true
      }
    });
    this.server.create('allowance', {subscription_type: 2, publicRepos: true, privateRepos: true});

    signInUser(this.user);

    this.server.create('v2-plan-config', {
      id: 'free_tier_plan', name: 'Free Tier Plan', startingPrice: 0,
      startingUsers: 999999, privateCredits: 10000, publicCredits: 40000,
      isFree: true, isUnlimitedUsers: true, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered'
    });
    this.server.create('v2-plan-config', {
      id: 'standard_tier_plan', name: 'Standard Tier Plan', startingPrice: 3000,
      startingUsers: 100, privateCredits: 25000, publicCredits: 40000,
      isFree: false, isUnlimitedUsers: false, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered'
    });
    this.defaultV2Plan = this.server.create('v2-plan-config', {
      id: 'pro_tier_plan', name: 'Pro Tier Plan', startingPrice: 30000,
      startingUsers: 10000, privateCredits: 500000, publicCredits: 40000,
      isFree: false, isUnlimitedUsers: false, addonConfigs: [{ type: 'credit_private' }, { type: 'credit_public'}, { type: 'user_license'}],
      hasCreditAddons: true, hasOSSCreditAddons: true, planType: 'metered'
    });
    this.defaultV2Plan.save();

    this.v2subscription = this.server.create('v2-subscription', {
      owner: this.user,
      status: 'subscribed',
      valid_to: new Date(),
      addons: [
        {name: 'User license addon', type: 'user_license', current_usage: {addon_usage: 1}},
        {name: 'Private credit addon', type: 'credit_private', current_usage: {addon_usage: 60}}
      ]
    });

    const account = { id: 1, hasSubscriptionPermissions: true, type: 'Organization' };
    this.setProperties({
      account,
    });
  });

  test('view plan usage', async function (assert) {
    await profilePage.visit();
    await profilePage.planUsage.visit();

    percySnapshot(assert);

    assert.equal(profilePage.planUsage.page.uniquUsers.text, '1 Unique users who are running builds');
    assert.equal(profilePage.planUsage.page.macMinutes.text, '3 min');
    assert.equal(profilePage.planUsage.page.windowsMinutes.text, '2 min');
    assert.equal(profilePage.planUsage.page.linuxMinutes.text, '1 min');
    assert.equal(profilePage.planUsage.page.creditsTotal.text, '60');
    assert.equal(profilePage.planUsage.page.minutesTotal.text, '6');
  });

  test('click Check users activity', async function (assert) {
    await profilePage.visit();
    await profilePage.planUsage.visit();
    await profilePage.planUsage.checkUserActivity.visit();

    percySnapshot(assert);

    assert.equal(profilePage.planUsage.checkUserActivity.uniqueUsers.text, '1 active users');
    assert.equal(profilePage.planUsage.checkUserActivity.userName.text, 'user-login');
    assert.equal(profilePage.planUsage.checkUserActivity.minutesConsumed.text, '1');
    assert.equal(profilePage.planUsage.checkUserActivity.creditsConsumed.text, '0');
  });
});
