import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | user settings');

test('changing feature flags', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

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

  server.patch(`/user/${currentUser.id}/beta_feature/${jantsFeature.id}`, function (schema, request) {
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
