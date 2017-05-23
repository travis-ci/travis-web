import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import defaultHeader from 'travis/tests/pages/header/default';
import defaultLayout from 'travis/tests/pages/layouts/default';

moduleForAcceptance('Acceptance | layouts/default');

test('header layout when unauthenticated', function (assert) {
  defaultHeader.visit();

  andThen(function () {
    assert.ok(defaultLayout.headerWrapperWhenUnauthenticated, 'Header is wrapped within proper DOM');
    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.equal(defaultHeader.navigationLinks(0).title, 'Blog', 'Shows link to Blog');
    assert.equal(defaultHeader.navigationLinks(1).title, 'Status', 'Shows link to Status');

    assert.ok(defaultHeader.helpDropdownPresent, 'Default header has help dropdown');
    assert.equal(defaultHeader.helpLinks(0).title, 'Read Our Docs', 'Shows Docs help link');
    assert.equal(defaultHeader.helpLinks(1).title, 'Imprint', 'Shows Link to Imprint');

    assert.ok(defaultHeader.loginLinkPresent, 'Default header has login button');
  });
});

test('header layout when authenticated', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

  defaultHeader.visit();

  andThen(function () {
    assert.ok(defaultLayout.headerWrapperWhenAuthenticated, 'Header is wrapped within proper DOM');
    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.ok(defaultHeader.broadcastsPresent, 'Default header shows broadcasts tower');
    assert.equal(defaultHeader.navigationLinks(0).title, 'Blog', 'Shows link to Blog');
    assert.equal(defaultHeader.navigationLinks(1).title, 'Status', 'Shows link to Status');

    assert.ok(defaultHeader.helpDropdownPresent, 'Default header has help dropdown');
    assert.equal(defaultHeader.helpLinks(0).title, 'Read Our Docs', 'Shows Docs help link');
    assert.equal(defaultHeader.helpLinks(1).title, 'Imprint', 'Shows Link to Imprint');

    assert.ok(defaultHeader.profileLinkPresent, 'Default header shows profile links');
  });
});
