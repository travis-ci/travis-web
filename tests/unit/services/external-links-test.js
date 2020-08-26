import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | external-links', function (hooks) {
  setupTest(hooks);

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

  test('billingUrl as organization', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('organization', 'travis-ci'), 'https://travis-ci.com/organizations/travis-ci/plan');
  });

  test('billingUrl as user', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('user', 'travis-ci'), 'https://travis-ci.com/account/plan');
  });
});

module('Unit | Service | external-links | VCS', function (hooks) {
  setupTest(hooks);

  const owner = 'user';
  const repo = 'repo';

  test('repoUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');

    assert.equal(service.repoUrl('GithubRepository', { owner, repo }), `https://github.com/${owner}/${repo}`);
  });

  test('branchUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branch = 'branch';

    assert.equal(service.branchUrl('GithubRepository', { owner, repo, branch }), `https://github.com/${owner}/${repo}/tree/${branch}`);
  });

  test('tagUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const tag = 'tag';

    assert.equal(service.tagUrl('GithubRepository', { owner, repo, tag }), `https://github.com/${owner}/${repo}/releases/tag/${tag}`);
  });

  test('commitUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const commit = 'sha';

    assert.equal(service.commitUrl('GithubRepository', { owner, repo, commit }), `https://github.com/${owner}/${repo}/commit/${commit}`);
  });

  test('fileUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branch = 'branch';
    const file = 'file';

    assert.equal(service.fileUrl('GithubRepository', { owner, repo, branch, file }), `https://github.com/${owner}/${repo}/blob/${branch}/${file}`);
  });

  test('issueUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const issue = '123';

    assert.equal(service.issueUrl('GithubRepository', { owner, repo, issue }), `https://github.com/${owner}/${repo}/issues/${issue}`);
  });

  test('profileUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const owner = 'username';

    assert.equal(service.profileUrl('GithubUser', { owner }), `https://github.com/${owner}`);
  });
});
