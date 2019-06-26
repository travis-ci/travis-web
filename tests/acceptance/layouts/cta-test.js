import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import existingRepoPage from 'travis/tests/pages/repo-tabs/current';
import defaultHeader from 'travis/tests/pages/header/default';
import signInUser from 'travis/tests/helpers/sign-in-user';
import signOutUser from 'travis/tests/helpers/sign-out-user';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | layouts/cta', function (hooks) {
  setupApplicationTest(hooks);

  test('cta is shown on .org when not on landing page and unauthenticated', async function (assert) {
    enableFeature('landingPageCta');
    const currentUser = server.create('user');
    signOutUser(currentUser);
    server.create('repository');
    await existingRepoPage.visit();

    assert.equal(defaultHeader.cta.text, 'Help make Open Source a better place and start building better software today!', 'Shows correct CTA text');
  });

  test('cta is shown for an open-source repository when GitHub Apps is present and not authenticated', async function (assert) {
    enableFeature('github-apps');
    server.create('repository');
    await existingRepoPage.visit();

    assert.equal(defaultHeader.cta.text, 'Join over 500,000 developers testing and building on Travis CI');
  });

  test('cta is not shown for an open-source repository when GitHub Apps is present and authenticated', async function (assert) {
    enableFeature('github-apps');
    server.create('repository');

    const currentUser = server.create('user');
    signInUser(currentUser);

    await existingRepoPage.visit();

    assert.ok(defaultHeader.cta.isHidden);
  });
});
