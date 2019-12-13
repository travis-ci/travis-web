import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { visit } from '@ember/test-helpers';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | broadcasts', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    // create active repo
    this.server.create('repository', {
      slug: 'org-login/repository-name'
    });
  });

  test('the broadcast tower shows a warning even when an announcement exists, broadcasts are listed in reverse order, and closing a broadcast records it', async function (assert) {
    enableFeature('broadcasts');

    let date = new Date();

    this.server.create('broadcast', {
      category: 'warning',
      message: 'A warning',
      created_at: date,
      id: 1883
    });

    this.server.create('broadcast', {
      category: 'announcement',
      message: 'An announcement',
      created_at: date,
      id: 2016
    });

    await visit('/dashboard');

    assert.ok(topPage.broadcastTower.hasWarning, 'expected the broadcast tower to have a warning class');
    assert.ok(topPage.broadcasts.isClosed, 'expected the broadcast list to be closed');
    assert.equal(topPage.broadcastBadge.text, 2, 'expected the badge to show two broadcasts');

    await topPage.broadcastTower.click();

    assert.ok(topPage.broadcasts.isOpen, 'expected the broadcast list to be open');
    assert.equal(topPage.broadcasts.items.length, 2, 'expected there to be two broadcasts');

    topPage.broadcasts.items[0].as(announcement => {
      assert.ok(announcement.isAnnouncement, 'expected the first broadcast to be an announcement');
      assert.equal(announcement.message, 'An announcement');
      assert.equal(announcement.title, `Transmitted on ${date.toISOString()}`);
    });

    assert.ok(topPage.broadcasts.items[1].isWarning, 'expected the second broadcast to be a warning');
    assert.equal(topPage.broadcasts.items[1].message, 'A warning');

    percySnapshot(assert);

    await topPage.broadcasts.items[0].dismiss();

    assert.ok(topPage.broadcasts.items.length, 1, 'expected there to be one broadcast');
    assert.equal(topPage.broadcastBadge.text, 1, 'expected the badge to show one broadcast');
    assert.ok(topPage.broadcasts.items[0].isWarning, 'expected the remaining broadcast to be a warning');

    assert.equal(localStorage.getItem('travis.seen_broadcasts'), JSON.stringify(['2016']));
  });

  test('the broadcast tower shows an announcement', async function (assert) {
    enableFeature('broadcasts');

    this.server.create('broadcast', {
      category: 'announcement',
      message: 'Another announcement'
    });

    await visit('/dashboard');

    assert.ok(topPage.broadcastTower.hasAnnouncement, 'expected the broadcast tower to have an announcement class');
  });

  test('a dismissed broadcast does not highlight the tower', async function (assert) {
    enableFeature('broadcasts');

    this.server.create('broadcast', {
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
