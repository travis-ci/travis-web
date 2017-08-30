import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/repo-not-active';

moduleForAcceptance('Acceptance | subscribing pusher to public repo');

test('viewing public repo results in a repo pusher channel', function (assert) {
  const repo = server.create('repository', {
    slug: 'musterfrau/a-repo',
    private: false
  });

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    let subscribed = this.application.resolveRegistration('pusher:main').active_channels.includes(`repo-${repo.id}`);
    assert.ok(subscribed, 'user is subscribed to a repo channel');
  });
});

test('viewing public repo as a signed collaborator does not trigger subscription', function (assert) {
  const user = server.create('user', {
    name: 'Travis CI',
    login: 'travisci',
  });
  const repository = server.create('repository', {
    slug: 'musterfrau/a-repo',
    private: false
  });
  server.create('permission', { user, repository, push: true });

  signInUser(user);

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    let subscribed = this.application.resolveRegistration('pusher:main').active_channels.includes(`repo-${repository.id}`);
    assert.ok(!subscribed, 'user is not subscribed to a repo channel');
  });
});

test('viewing public repo as a signed user triggers subscription', function (assert) {
  const user = server.create('user', {
    name: 'Travis CI',
    login: 'travisci',
  });
  const repository = server.create('repository', {
    slug: 'musterfrau/a-repo',
    private: false
  });
  server.schema.permissions.all().destroy();

  signInUser(user);

  page.visit({ organization: 'musterfrau', repo: 'a-repo' });

  andThen(() => {
    let subscribed = this.application.resolveRegistration('pusher:main').active_channels.includes(`repo-${repository.id}`);
    assert.ok(subscribed, 'user is subscribed to a repo channel');
  });
});
