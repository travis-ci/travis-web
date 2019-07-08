import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { settled } from '@ember/test-helpers';
import page from 'travis/tests/pages/caches';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | repo caches', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    const repository = server.create('repository', {
      slug: 'org-login/repository-name'
    });

    this.repository = repository;

    const oneDayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);

    repository.createCache({
      branch: 'a-branch-name',
      lastModified: oneDayAgo,
      size: 89407938
    });

    const twoDaysAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);
    const threeDaysAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3);

    repository.createCache({
      branch: 'PR.1919',
      lastModified: twoDaysAgo,
      size: 10061087
    });

    repository.createCache({
      branch: 'PR.1919',
      lastModified: threeDaysAgo,
      size: 10061086
    });
  });

  test('view and delete caches', async function (assert) {
    await page.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.equal(page.pushCaches.length, 1, 'expected one push cache');
    assert.ok(page.tabIsActive, 'expected the caches tab to be active');

    page.pushCaches[0].as(pushCache => {
      assert.equal(pushCache.name, 'a-branch-name');
      assert.equal(pushCache.lastModified, 'a day ago');
      assert.equal(pushCache.size, '85.27MB');
    });

    assert.equal(page.pullRequestCaches.length, 1, 'expected one pull request cache');

    page.pullRequestCaches[0].as(pullRequestCache => {
      assert.equal(pullRequestCache.name, 'PR.1919');
      assert.equal(pullRequestCache.lastModified, '2 days ago');
      assert.equal(pullRequestCache.size, '19.19MB');
    });

    assert.notOk(page.noCachesExist, 'expected the message that no caches exist to not be present');
    percySnapshot(assert);

    const branchQueryParams = [];

    server.delete(`/repo/${this.repository.id}/caches`, function (schema, {queryParams}) {
      branchQueryParams.push(queryParams.branch || 'empty');
    });

    await page.pushCaches[0].delete();
    await settled();

    assert.deepEqual(branchQueryParams.pop(), 'a-branch-name');

    assert.equal(page.pushCaches.length, 0);

    await page.deleteAllCaches();
    await settled();

    assert.equal(branchQueryParams.pop(), 'empty', 'expected the delete all request to have no body');
    assert.ok(page.noCachesExist, 'expected the message that no caches exist to be displayed');
  });
});
