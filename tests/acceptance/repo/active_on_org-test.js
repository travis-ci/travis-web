import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/repo-not-active';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | repo not active');

test('view an active_on_org repository when GitHub Apps is present', function (assert) {
  withFeature('github-apps');

  const user = server.create('user', {
    name: 'Erika Musterfrau',
    login: 'musterfrau'
  });

  signInUser(user);

  server.create('repository', {
    slug: 'musterfrau/a-repo',
    active: true,
    active_on_org: true,
    permissions: {
      admin: true
    }
  });

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    percySnapshot(assert);
    assert.dom('[data-test-active_on_org-display]').exists();
    assert.dom('a.button').hasAttribute('href', 'https://travis-ci.org/musterfrau/a-repo');
  });
});
