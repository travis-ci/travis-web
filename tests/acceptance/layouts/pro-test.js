import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proHeader from 'travis/tests/pages/header/pro';

moduleForAcceptance('Acceptance | layouts/pro');

test('header layout when unauthenticated', function (assert) {
  withFeature('proVersion');

  proHeader.visit();

  andThen(function () {
    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks(0).title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks(1).title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks(2).title, 'Enterprise', 'Shows link to Enterprise offering');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
  });
});
