import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

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

