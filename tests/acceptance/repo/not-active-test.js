import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/repo-not-active';

moduleForAcceptance('Acceptance | repo not active');

test('view inactive repo when not an admin or signed out', function (assert) {
  server.create('repository', {
    slug: 'musterfrau/a-repo',
    active: false,
    permissions: {
      admin: false
    }
  });

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    assert.ok(page.notActiveHeadline, 'Displays not active headline');
    assert.equal(page.notActiveNotice, 'You don\'t have sufficient rights to enable this repo on Travis. Please contact the admin to enable it or to receive admin rights yourself.', 'Displays non-admin notice');
    assert.notOk(page.activateButton, 'Does not show activation button');
  });
});

test('view inactive repo when admin and activate it', function (assert) {
  server.create('repository', {
    slug: 'musterfrau/a-repo',
    active: false,
    permissions: {
      admin: true
    }
  });

  const user = server.create('user', {
    name: 'Erika Musterfrau',
    login: 'musterfrau'
  });

  signInUser(user);

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    assert.ok(page.notActiveHeadline, 'Displays not active headline');
    assert.equal(page.notActiveNotice, 'You can activate the repository on your profile, or by clicking the button below', 'Displays admin notice');
    assert.ok(page.activateButton, 'Show activation button');
  });
});
