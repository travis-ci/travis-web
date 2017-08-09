import { moduleFor, test } from 'ember-qunit';
import config from 'travis/config/environment';

const { apiEndpoint } = config;

moduleFor('service:external-links', 'Unit | Service | external-links', {
  beforeEach() {
    this.id = '1';
    this.slug = 'travis-ci/travis-web';
    this.sha = '123abc';
    this.branch = 'new-pr';
    this.pullRequestNumber = '999';
  }
});

test('plainTextLog', function (assert) {
  let service = this.subject();
  assert.equal(service.plainTextLog(this.id), `${apiEndpoint}/jobs/1/log.txt?deansi=true`);
});

test('githubPullRequest', function (assert) {
  let service = this.subject();
  assert.equal(service.githubPullRequest(this.slug, this.pullRequestNumber), 'https://github.com/travis-ci/travis-web/pull/999');
});

test('githubCommit', function (assert) {
  let service = this.subject();
  assert.equal(service.githubCommit(this.slug, this.sha), 'https://github.com/travis-ci/travis-web/commit/123abc');
});

test('githubRepo', function (assert) {
  let service = this.subject();
  assert.equal(service.githubRepo(this.slug), 'https://github.com/travis-ci/travis-web');
});

test('email', function (assert) {
  let service = this.subject();
  const email = 'builder@travis-ci.com';
  assert.equal(service.email(email), 'mailto:builder@travis-ci.com');
});

test('travisWebBranch', function (assert) {
  const service = this.subject();
  const branchName = 'bd-no-justice-no-peace';

  assert.equal(service.travisWebBranch(branchName), 'https://github.com/travis-ci/travis-web/tree/bd-no-justice-no-peace');
});

test('githubBranch', function (assert) {
  let service = this.subject();
  assert.equal(service.githubBranch(this.slug, this.branch), 'https://github.com/travis-ci/travis-web/tree/new-pr');
});

test('billingUrl as organization', function (assert) {
  let service = this.subject();
  assert.equal(service.billingUrl('organization', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/travis-ci');
});

test('billingUrl as user', function (assert) {
  let service = this.subject();
  assert.equal(service.billingUrl('user', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/user');
});
