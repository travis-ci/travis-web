import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import defaultHeader from 'travis/tests/pages/header/default';
import footer from 'travis/tests/pages/footer';

moduleForAcceptance('Acceptance | layouts/logo page');

test('logo page renders correct header/footer', function (assert) {
  visit('/logo');

  andThen(function () {
    assert.equal(currentURL(), '/logo');

    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.equal(defaultHeader.navigationLinks[0].title, 'About Us', 'Shows link to About Us');
    assert.equal(defaultHeader.navigationLinks[1].title, 'Blog', 'Shows link to Blog');
    assert.equal(defaultHeader.navigationLinks[2].title, 'Status', 'Shows link to Status');

    assert.ok(defaultHeader.helpDropdownPresent, 'Default header has help dropdown');
    assert.equal(defaultHeader.helpLinks[0].title, 'Read Our Docs', 'Shows Docs help link');
    assert.equal(defaultHeader.helpLinks[1].title, 'Imprint', 'Shows Link to Imprint');

    assert.ok(defaultHeader.loginLinkPresent, 'Default header has login button');

    assert.equal(footer.sections[2].title, '©Travis CI, GmbH', 'Shows company info section');
    assert.equal(footer.sections[3].title, 'Help', 'Shows help info section');
  });
});
