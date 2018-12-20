import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click } from '@ember/test-helpers';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | broadcasts', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    // create active repo
    server.create('repository', {
      slug: 'org-login/repository-name'
    });

    // reset the seen broadcasts to avoid state bleeding over
    localStorage.setItem('travis.seen_broadcasts', []);
  });

  test('the broadcast tower shows a warning even when an announcement exists, broadcasts are listed in reverse order, and closing a broadcast records it', async (assert) => {
    enableFeature('broadcasts');

    server.create('broadcast', {
      category: 'warning',
      message: 'A warning'
    });

    server.create('broadcast', {
      category: 'announcement',
      message: 'An announcement',
      id: 2016
    });

    await visit('/dashboard');

    assert.ok(topPage.broadcastTower.hasWarning, 'expected the broadcast tower to have a warning class');
    assert.ok(topPage.broadcasts.isClosed, 'expected the broadcast list to be closed');
    assert.equal(topPage.broadcastBadge.text, 2, 'expected the badge to show two broadcasts');

    await click('[data-test-broadcast-tower]');

    assert.ok(topPage.broadcasts.isOpen, 'expected the broadcast list to be open');
    assert.equal(topPage.broadcasts.items.length, 2, 'expected there to be two broadcasts');

    assert.ok(topPage.broadcasts.items[0].isAnnouncement, 'expected the first broadcast to be an announcement');
    assert.equal(topPage.broadcasts.items[0].message, 'An announcement');

    assert.ok(topPage.broadcasts.items[1].isWarning, 'expected the second broadcast to be a warning');
    assert.equal(topPage.broadcasts.items[1].message, 'A warning');

    percySnapshot(assert);

    await topPage.broadcasts.items[0].dismiss();

    assert.ok(topPage.broadcasts.items.length, 1, 'expected there to be one broadcast');
    assert.equal(topPage.broadcastBadge.text, 1, 'expected the badge to show one broadcast');
    assert.ok(topPage.broadcasts.items[0].isWarning, 'expected the remaining broadcast to be a warning');

    assert.equal(localStorage.getItem('travis.seen_broadcasts'), JSON.stringify(['2016']));
  });

  test('the broadcast tower shows an announcement', async (assert) => {
    enableFeature('broadcasts');

    server.create('broadcast', {
      category: 'announcement',
      message: 'Another announcement'
    });

    await visit('/dashboard');

    assert.ok(topPage.broadcastTower.hasAnnouncement, 'expected the broadcast tower to have an announcement class');
  });

  test('a dismissed broadcast does not highlight the tower', async (assert) => {
    enableFeature('broadcasts');

    server.create('broadcast', {
      category: 'announcement',
      message: 'Welcome.',
      id: '2016'
    });

    localStorage.setItem('travis.seen_broadcasts', JSON.stringify(['2016']));

    await visit('/dashboard');

    assert.ok(topPage.broadcastTower.hasNoAnnouncement, 'expected the broadcast tower to not have an announcement class');
    assert.ok(topPage.broadcastBadge.isHidden, 'expected there to be no broadcast count');
  });
});
