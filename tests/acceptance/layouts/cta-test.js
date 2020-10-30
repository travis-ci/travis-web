import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import existingRepoPage from 'travis/tests/pages/repo-tabs/current';
import defaultHeader from 'travis/tests/pages/header/default';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | layouts/cta', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', {
      name: 'Travis CI',
      login: 'travis-ci',
    });

    this.server.create('allowance', {subscription_type: 1});
  });

  test('cta is shown on .org when not on landing page and unauthenticated', async function (assert) {
    enableFeature('landingPageCta');
    this.server.create('repository', { owner: { login: 'travis-ci', id: 1 }});
    await existingRepoPage.visit();

    assert.equal(defaultHeader.cta.text, 'Help make Open Source a better place and start building better software today!', 'Shows correct CTA text');
  });

  test('cta is shown for an open-source repository when GitHub Apps is present and not authenticated', async function (assert) {
    enableFeature('github-apps');
    this.server.create('repository', { owner: { login: 'travis-ci', id: 1 }});
    await existingRepoPage.visit();

    assert.equal(defaultHeader.cta.text, 'Join over 500,000 developers testing and building on Travis CI');
  });

  test('cta is not shown for an open-source repository when GitHub Apps is present and authenticated', async function (assert) {
    enableFeature('github-apps');
    this.server.create('repository', { owner: { login: 'travis-ci', id: 1 }});

    signInUser(this.currentUser);

    await existingRepoPage.visit();

    assert.ok(defaultHeader.cta.isHidden);
  });
});
