import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { settled } from '@ember/test-helpers';
import { INSIGHTS_VIS_OPTIONS } from 'travis/controllers/account/settings';

moduleForAcceptance('Acceptance | user settings', {
  beforeEach() {
    const user = server.create('user');
    signInUser(user);
    this.user = user;

    server.create('organization', {
      name: 'Org Name',
      type: 'organization',
      login: 'org-login',
      permissions: {
        createSubscription: false
      }
    });

    server.loadFixtures('preferences');
  }
});

test('changing feature flags', function (assert) {
  server.create('feature', {
    name: 'jorts',
    description: 'Jorts!',
    enabled: true
  });

  const jantsFeature = server.create('feature', {
    name: 'jants',
    description: 'Jants?',
    enabled: false
  });

  profilePage.visit();
  profilePage.settings.visit();

  percySnapshot(assert);

  andThen(function () {
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
  });

  let patchRequestBody;

  server.patch(`/user/${this.user.id}/beta_feature/${jantsFeature.id}`, function (schema, request) {
    patchRequestBody = JSON.parse(request.requestBody);
    const feature = schema.features.find(jantsFeature.id);
    feature.enabled = true;
    return feature;
  });

  profilePage.settings.features[0].click();

  andThen(() => {
    assert.ok(profilePage.settings.features[0].isOn, 'expected the jants switch to now be on');
    assert.deepEqual(patchRequestBody, { 'beta_feature.enabled': true });
  });
});

test('no settings for org', function (assert) {
  profilePage.visit();

  andThen(() => {
    assert.ok(profilePage.settings.isPresent);
  });

  profilePage.settings.visit();
  profilePage.accounts[1].visit();

  andThen(() => {
    assert.ok(profilePage.settings.isHidden);
    assert.equal(currentURL(), '/organizations/org-login/repositories');
  });

  visit('/organizations/org-login/preferences');

  andThen(() => {
    assert.equal(currentURL(), '/organizations/org-login/repositories');
  });
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

  server.createList('repository', AMOUNT_OF_REPOS, {
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
  server.create('repository', { email_subscribed: false });

  await profilePage.visit({ username: 'testuser' });
  await profilePage.settings.visit();

  const { emailSettings } = profilePage.settings;

  await emailSettings.toggle.click();

  assert.equal(emailSettings.resubscribeList.items.length, 1);

  await emailSettings.resubscribeList.items[0].click();

  assert.ok(!emailSettings.resubscribeList.isPresent);
});

test('Insights settings are not listed in non-PRO version', async function (assert) {
  await profilePage.visit({ username: 'testuser' });
  await profilePage.settings.visit();

  const { insightsSettings } = profilePage.settings;

  assert.ok(!insightsSettings.isVisible);
});

test('Insights settings are listed in PRO version', async function (assert) {
  withFeature('proVersion');
  await profilePage.visit({ username: 'testuser' });
  await profilePage.settings.visit();

  const { insightsSettings } = profilePage.settings;

  assert.ok(insightsSettings.isVisible);
  assert.ok(insightsSettings.title.length > 0);
  assert.ok(insightsSettings.description.length > 0);
  assert.ok(insightsSettings.visibilityList.isVisible);
});

test('User can select a different privacy setting', async function (assert) {
  withFeature('proVersion');
  await profilePage.visit({ username: 'testuser' });
  await profilePage.settings.visit();

  const { modal, submit, visibilityList } = profilePage.settings.insightsSettings;
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

  // Select option
  await privateOption.click();

  assert.ok(privateOption.isSelected);
  assert.notOk(submit.isDisabled);

  // Click save
  await submit.click();
  await settled();

  // Modal should show
});
