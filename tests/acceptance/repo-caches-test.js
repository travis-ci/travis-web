import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/caches';

import Ember from 'ember';

moduleForAcceptance('Acceptance | repo caches', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    const repository = server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });

    const oneDayAgo = new Date(new Date().getTime() - 1000*60*60*24);

    repository.createCache({
      branch: 'a-branch-name',
      lastModified: oneDayAgo,
      size: 89407938
    });

    const twoDaysAgo = new Date(new Date().getTime() - 1000*60*60*24*2);

    repository.createCache({
      branch: 'PR.1919',
      lastModified: twoDaysAgo,
      size: 20122173
    });
  }
});

test('view and delete caches', function(assert) {
  page.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(page.pushCaches().count, 1, 'expected one push cache');

    const pushCache = page.pushCaches(0);

    assert.equal(pushCache.name, 'a-branch-name');
    assert.equal(pushCache.lastModified, 'a day ago');
    assert.equal(pushCache.size, '85.27MB');

    const pullRequestCache = page.pullRequestCaches(0);

    assert.equal(page.pullRequestCaches().count, 1, 'expected one pull request cache');

    assert.equal(pullRequestCache.name, 'PR.1919');
    assert.equal(pullRequestCache.lastModified, '2 days ago');
    assert.equal(pullRequestCache.size, '19.19MB');
  });
});
