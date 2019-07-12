import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | external-links', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.repo = {
      id: '1',
      slug: 'travis-ci/travis-web',
    };

    this.build = {
      pullRequestNumber: '999',
      branch: 'new-pr',
    };

    this.commit = {
      sha: '123abc',
    };
  });

  test('githubPullRequest', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.githubPullRequest(this.repo.slug, this.build.pullRequestNumber), 'https://github.com/travis-ci/travis-web/pull/999');
  });

  test('githubCommit', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.githubCommit(this.repo.slug, this.commit.sha), 'https://github.com/travis-ci/travis-web/commit/123abc');
  });

  test('email', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const email = 'builder@travis-ci.com';
    assert.equal(service.email(email), 'mailto:builder@travis-ci.com');
  });

  test('travisWebBranch', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branchName = 'bd-no-justice-no-peace';

    assert.equal(service.travisWebBranch(branchName), 'https://github.com/travis-ci/travis-web/tree/bd-no-justice-no-peace');
  });

  test('githubBranch', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.githubBranch(this.repo.slug, this.build.branch), 'https://github.com/travis-ci/travis-web/tree/new-pr');
  });

  test('billingUrl as organization', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('organization', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/travis-ci');
  });

  test('billingUrl as user', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('user', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/user');
  });
});
