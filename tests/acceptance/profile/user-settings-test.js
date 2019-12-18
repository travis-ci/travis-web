import { currentURL, visit, waitFor } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import topPage from 'travis/tests/pages/top';
import { enableFeature } from 'ember-feature-flags/test-support';
import { INSIGHTS_VIS_OPTIONS } from 'travis/controllers/account/settings';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user settings', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const user = this.server.create('user');
    signInUser(user);
    this.user = user;

    this.server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      permissions: {
        createSubscription: false
      }
    });

    this.server.loadFixtures('preferences');
  });

  test('changing feature flags', async function (assert) {
    this.server.create('feature', {
      name: 'jorts',
      description: 'Jorts!',
      enabled: true
    });

    const jantsFeature = this.server.create('feature', {
      name: 'jants',
      description: 'Jants?',
      enabled: false
    });

    await profilePage.visit();
    await profilePage.settings.visit();

    percySnapshot(assert);

    assert.equal(profilePage.settings.features.length, 2, 'expected there to be two features');

    profilePage.settings.features[0].as(jants => {
      assert.equal(jants.name, 'Jants');
      assert.equal(jants.description, 'Jants?');
      assert.notOk(jants.isOn, 'expected the jants switch to be off');
    });

    profilePage.settings.features[1].as(jorts => {
      assert.equal(jorts.name, 'Jorts');
      assert.equal(jorts.description, 'Jorts!');
      assert.ok(jorts.isOn, 'expected the jorts switch to be on');
    });

    let patchRequestBody;

    this.server.patch(`/user/${this.user.id}/beta_feature/${jantsFeature.id}`, function (schema, request) {
      patchRequestBody = JSON.parse(request.requestBody);
      const feature = schema.features.find(jantsFeature.id);
      feature.enabled = true;
      return feature;
    });

    await profilePage.settings.features[0].click();

    assert.ok(profilePage.settings.features[0].isOn, 'expected the jants switch to now be on');
    assert.deepEqual(patchRequestBody, { 'beta_feature.enabled': true });
  });

  test('no settings for org', async function (assert) {
    await profilePage.visit();

    assert.ok(profilePage.settings.isPresent);

    await profilePage.settings.visit();
    await profilePage.accounts[1].visit();

    assert.ok(profilePage.settings.isHidden);
    assert.equal(currentURL(), '/organizations/org-login/repositories');

    await visit('/organizations/org-login/preferences');

    assert.equal(currentURL(), '/organizations/org-login/repositories');
  });

  test('Email settings are listed', async function (assert) {
    await profilePage.visit({ username: 'testuser' });
    await profilePage.settings.visit();

    const { emailSettings } = profilePage.settings;

    assert.ok(emailSettings.isVisible);
    assert.ok(emailSettings.title.length > 0);
    assert.ok(emailSettings.description.length > 0);
    assert.ok(emailSettings.toggle.isVisible);
  });

  test('Email settings can be toggled', async function (assert) {
    const AMOUNT_OF_REPOS = 3;

    this.server.createList('repository', AMOUNT_OF_REPOS, {
      email_subscribed: false
    });

    await profilePage.visit({ username: 'testuser' });
    await profilePage.settings.visit();

    const { emailSettings } = profilePage.settings;

    assert.ok(!emailSettings.toggle.isOn);
    assert.ok(!emailSettings.resubscribeList.isPresent);

    await emailSettings.toggle.click();

    percySnapshot(assert);

    assert.ok(emailSettings.toggle.isOn);
    assert.ok(emailSettings.resubscribeList.isPresent);
    assert.equal(emailSettings.resubscribeList.items.length, AMOUNT_OF_REPOS);
  });

  test('User can resubscribe to repository', async function (assert) {
    this.server.create('repository', { email_subscribed: false });

    await profilePage.visit({ username: 'testuser' });
    await profilePage.settings.visit();

    const { emailSettings } = profilePage.settings;

    await emailSettings.toggle.click();

    assert.equal(emailSettings.resubscribeList.items.length, 1);

    await emailSettings.resubscribeList.items[0].click();

    assert.ok(!emailSettings.resubscribeList.isPresent);
  });

  test('Insights settings are not listed in non-PRO version', async function (assert) {
    await profilePage.visit({ username: this.user.login });
    await profilePage.settings.visit();

    const { insightsSettings } = profilePage.settings;

    assert.ok(!insightsSettings.isVisible);
  });

  test('Insights settings are listed in PRO version', async function (assert) {
    enableFeature('proVersion');
    await profilePage.visit({ username: this.user.login });
    await profilePage.settings.visit();

    const { insightsSettings } = profilePage.settings;

    assert.ok(insightsSettings.isVisible);
    assert.ok(insightsSettings.title.length > 0);
    assert.ok(insightsSettings.description.length > 0);
    assert.equal(insightsSettings.description,
      `Make more informed decisions about your development workflow using your build Insights. View ${this.user.name}'s Insights`
    );
    assert.ok(insightsSettings.visibilityList.isVisible);
  });

  test('User can select a different privacy setting', async function (assert) {
    enableFeature('proVersion');
    await profilePage.visit({ username: this.user.login });
    await profilePage.settings.visit();

    const { submit, visibilityList } = profilePage.settings.insightsSettings;
    const { insightsSettingsModal } = profilePage.settings;
    const [privateOption, publicOption] = visibilityList.items;

    assert.equal(visibilityList.items.length, INSIGHTS_VIS_OPTIONS.length);
    const expectedPrivate = INSIGHTS_VIS_OPTIONS.find(option => option.key === 'private');
    const expectedPublic = INSIGHTS_VIS_OPTIONS.find(option => option.key === 'public');

    // Default state
    assert.equal(privateOption.description, expectedPrivate.description);
    assert.notOk(privateOption.isSelected);
    assert.equal(publicOption.description, expectedPublic.description);
    assert.ok(publicOption.isSelected);
    assert.ok(submit.isDisabled);
    assert.notOk(insightsSettingsModal.isVisible);

    // Select option
    await privateOption.click();
    assert.ok(privateOption.isSelected);
    assert.notOk(submit.isDisabled);

    // Click save, modal should show
    await submit.click();
    await waitFor(insightsSettingsModal.scope);
    assert.ok(insightsSettingsModal.isVisible);
    assert.equal(insightsSettingsModal.title, 'Restrict visibility of your private build insights');
    assert.equal(insightsSettingsModal.description, expectedPrivate.modalText);

    // Close modal with close button
    await insightsSettingsModal.closeButton.click();
    await waitFor(insightsSettingsModal.scope, { count: 0 });
    assert.notOk(insightsSettingsModal.isVisible);

    // Reopen modal
    await submit.click();
    await waitFor(insightsSettingsModal.scope);
    assert.ok(insightsSettingsModal.isVisible);

    // Close modal with cancel button
    await insightsSettingsModal.cancelButton.click();
    await waitFor(insightsSettingsModal.scope, { count: 0 });
    assert.notOk(insightsSettingsModal.isVisible);

    // Reopen modal
    await submit.click();
    await waitFor(insightsSettingsModal.scope);
    assert.ok(insightsSettingsModal.isVisible);

    // Confirm save
    await insightsSettingsModal.confirmButton.click();
    await waitFor(insightsSettingsModal.scope, { count: 0 });
    assert.notOk(insightsSettingsModal.isVisible);
    assert.equal(topPage.flashMessage.text, 'Your private build insights are now private.');
  });
});
