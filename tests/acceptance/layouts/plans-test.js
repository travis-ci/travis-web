import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proHeader from 'travis/tests/pages/header/pro';

moduleForAcceptance('Acceptance | layouts/plans page');

test('plans page renders correct header/footer', function (assert) {
  withFeature('proVersion');

  visit('/plans');

  andThen(function () {
    assert.equal(currentURL(), '/plans');

    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks(0).title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks(1).title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks(2).title, 'Enterprise', 'Shows link to Enterprise offering');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
  });
});

test('plans page redirects unless pro enabled', function (assert) {
  visit('/plans');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });
});
