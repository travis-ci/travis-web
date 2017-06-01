import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import existingRepoPage from 'travis/tests/pages/repo-tabs/current';
import defaultHeader from 'travis/tests/pages/header/default';

moduleForAcceptance('Acceptance | layouts/cta');

test('cta is shown on .org when not on landing page and unauthenticated', function (assert) {
  server.create('repository');
  existingRepoPage.visit();

  andThen(function () {
    assert.equal(defaultHeader.ctaText, 'Help make Open Source a better place and start building better software today!', 'Shows correct CTA text');
  });
});
