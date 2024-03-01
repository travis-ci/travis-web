import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { settled, getContext } from '@ember/test-helpers';
import page from 'travis/tests/pages/repo-not-active';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | subscribing pusher to public repo', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('viewing public repo results in a repo pusher channel', async function (assert) {
    const user = this.server.create('user', {
      name: 'Travis CI',
      login: 'travisci',
    });
    this.server.create('allowance', {subscription_type: 1});
    const repo = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      private: false,
      owner: {
        login: user.login,
        id: user.id
      }
    });

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    await settled();

    const { owner } = getContext();
    let subscribed = owner.lookup('pusher:main').active_channels.includes(`repo-${repo.id}`);

    assert.ok(subscribed, 'user is subscribed to a repo channel');
  });

  skip('viewing public repo as a signed in collaborator does not trigger subscription', async function (assert) {
    const user = this.server.create('user', {
      name: 'Travis CI',
      login: 'travisci',
    });
    this.server.create('allowance', {subscription_type: 1});
    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      private: false,
      owner: {
        login: user.login,
        id: user.id
      }
    });
    this.server.create('permission', { user, repository, push: true });

    signInUser(user);

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    await settled();

    const { owner } = getContext();
    let subscribed = owner.lookup('pusher:main').active_channels.includes(`repo-${repository.id}`);
    assert.notOk(subscribed, 'user is not subscribed to a repo channel');
  });

  test('viewing public repo as a signed in user triggers subscription', async function (assert) {
    const user = this.server.create('user', {
      name: 'Travis CI',
      login: 'travisci',
    });
    this.server.create('allowance', {subscription_type: 1});
    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      private: false,
      owner: {
        login: user.login,
        id: user.id
      }
    });
    this.server.schema.permissions.all().destroy();

    signInUser(user);

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    await settled();
    const { owner } = getContext();

    let subscribed = owner.lookup('pusher:main').active_channels.includes(`repo-${repository.id}`);
    assert.ok(subscribed, 'user is subscribed to a repo channel');
  });
});
