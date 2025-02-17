import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { enableFeature } from 'ember-feature-flags/test-support';

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

    this.organization = this.server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      vcs_type: 'GithubOrganization',
      vcs_id: 1983,
      github_id: 1983,
      permissions: {
        createSubscription: true,
        billing_view: true,
        plan_usage: true,
        plan_invoices: true,
        plan_view: true,
      }
    });
    this.organization.save();
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

    this.v2OrgSubscription = this.server.create('v2-subscription', {
      owner: this.organization,
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

  test('view user plan usage', async function (assert) {
    await profilePage.visit();
    await profilePage.planUsage.visit();
    assert.equal(profilePage.planUsage.page.minutesTotal.text, 'All repositories total build time: 6 minutes');
  });

  test('view organization plan usage', async function (assert) {
    enableFeature('github-apps');
    enableFeature('proVersion');
    await profilePage.visitOrganization({ name: 'org-login' });
    await profilePage.planUsage.visit();
    assert.equal(profilePage.planUsage.page.minutesTotal.text, 'All repositories total build time: 6 minutes');
    assert.equal(profilePage.planUsage.page.senders.items[1].login, 'cron');
  });
});
