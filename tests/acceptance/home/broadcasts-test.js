import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | home/sidebar tabs', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    // create active repo
    server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });
  }
});

test('the broadcast tower shows a warning even when an announcement exists, broadcasts are listed in reverse order, and closing a broadcast records it', (assert) => {
  server.create('broadcast', {
    category: 'warning',
    message: 'Join the resistance!'
  });

  server.create('broadcast', {
    category: 'announcement',
    message: 'We need you.',
    id: 2016
  });

  dashboardPage.visit();

  andThen(() => {
    assert.ok(topPage.broadcastTower.hasWarning, 'expected the broadcast tower to have a warning class');
    assert.ok(topPage.broadcasts().isClosed, 'expected the broadcast list to be closed');
    assert.equal(topPage.broadcastBadge.text, 2, 'expected the badge to show two broadcasts');
  });

  topPage.broadcastTower.click();

  andThen(() => {
    assert.ok(topPage.broadcasts().isOpen, 'expected the broadcast list to be open');
    assert.equal(topPage.broadcasts().count, 2, 'expected there to be two broadcasts');

    assert.ok(topPage.broadcasts(0).isAnnouncement, 'expected the first broadcast to be an announcement');
    assert.equal(topPage.broadcasts(0).message, 'We need you.');

    assert.ok(topPage.broadcasts(1).isWarning, 'expected the second broadcast to be a warning');
    assert.equal(topPage.broadcasts(1).message, 'Join the resistance!');
  });

  percySnapshot(assert);

  topPage.broadcasts(0).dismiss();

  andThen(() => {
    assert.ok(topPage.broadcasts().count, 1, 'expected there to be one broadcast');
    assert.equal(topPage.broadcastBadge.text, 1, 'expected the badge to show one broadcast');
    assert.ok(topPage.broadcasts(0).isWarning, 'expected the remaining broadcast to be a warning');

    assert.equal(localStorage.getItem('travis.seen_broadcasts'), JSON.stringify(['2016']));
  });
});

test('the broadcast tower shows an announcement', assert => {
  server.create('broadcast', {
    category: 'announcement',
    message: 'We have all joined the resistance.'
  });

  dashboardPage.visit();

  andThen(() => {
    assert.ok(topPage.broadcastTower.hasAnnouncement, 'expected the broadcast tower to have an announcement class');
  });
});

test('a dismissed broadcast does not highlight the tower', assert => {
  server.create('broadcast', {
    category: 'announcement',
    message: 'Welcome.',
    id: '2016'
  });

  localStorage.setItem('travis.seen_broadcasts', JSON.stringify(['2016']));

  dashboardPage.visit();

  andThen(() => {
    assert.ok(topPage.broadcastTower.hasNoAnnouncement, 'expected the broadcast tower to not have an announcement class');
    assert.ok(topPage.broadcastBadge.isHidden, 'expected there to be no broadcast count');
  });
});
