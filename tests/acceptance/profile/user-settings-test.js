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

  profilePage.visit({ username: 'testuser' });
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
  profilePage.visit({ username: 'testuser' });

  andThen(() => {
    assert.ok(profilePage.settings.isPresent);
  });

  profilePage.settings.visit();
  profilePage.accounts[1].visit();

  andThen(() => {
    assert.ok(profilePage.settings.isHidden);
    assert.equal(currentURL(), '/profile/org-login');
  });

  visit('/profile/org-login/settings');

  andThen(() => {
    assert.equal(currentURL(), '/profile/org-login');
  });
});
