import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import proHeader from 'travis/tests/pages/header/pro';
import footer from 'travis/tests/pages/footer';

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
    assert.equal(footer.sections(1).title, '©Travis CI, GmbH', 'Shows company info section');
    assert.equal(footer.sections(2).title, 'Help', 'Shows help info section');
    assert.equal(footer.sections(3).title, 'Legal', 'Shows legal info section');
    assert.equal(footer.sections(4).title, 'Travis CI Status', 'Shows status info section');
  });
});

test('plans page redirects unless pro enabled', function (assert) {
  visit('/plans');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });
});
