import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import existingRepoPage from 'travis/tests/pages/repo-tabs/current';
import defaultHeader from 'travis/tests/pages/header/default';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | layouts/cta');

test('cta is shown on .org when not on landing page and unauthenticated', function (assert) {
  withFeature('landingPageCta');
  server.create('repository');
  existingRepoPage.visit();

  andThen(function () {
    assert.equal(defaultHeader.cta.text, 'Help make Open Source a better place and start building better software today!', 'Shows correct CTA text');
  });
});

test('cta is shown for an open-source repository when GitHub Apps is present and not authenticated', function (assert) {
  withFeature('github-apps');
  server.create('repository');
  existingRepoPage.visit();

  andThen(function () {
    assert.equal(defaultHeader.cta.text, 'Join over 500,000 developers testing and building on Travis CI');
  });
});

test('cta is not shown for an open-source repository when GitHub Apps is present and authenticated', function (assert) {
  withFeature('github-apps');
  server.create('repository');

  const currentUser = server.create('user');
  signInUser(currentUser);

  existingRepoPage.visit();

  andThen(function () {
    assert.ok(defaultHeader.cta.isHidden);
  });
});
