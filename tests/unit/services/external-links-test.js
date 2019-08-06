import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { vcsEndpoints, vcsUrl } from 'travis/services/external-links';

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
    assert.equal(service.billingUrl('organization', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/travis-ci');
  });

  test('billingUrl as user', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('user', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/user');
  });

  const slug = 'user/repo';

  test('vcsEndpoints', function (assert) {
    assert.equal(vcsEndpoints.github, 'https://github.com');
    assert.equal(vcsEndpoints.bitbucket, 'https://bitbucket.org');
  });

  test('vcsUrl', function (assert) {
    const paths = {
      github: '/somepath',
      bitbucket: '/somepath',
    };

    assert.throws(vcsUrl, 'Throws if cannot find vcs');
    assert.throws(() => vcsUrl('Github'), 'Throws if cannot find path');

    assert.equal(vcsUrl(null, paths), 'https://github.com/somepath', 'Defaults to Github');
    assert.equal(vcsUrl('Github', paths), 'https://github.com/somepath');
    assert.equal(vcsUrl('Bitbucket', paths), 'https://bitbucket.org/somepath');
  });

  test('repoUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.repoUrl('Github', slug), `${vcsEndpoints.github}/${slug}`);
    assert.equal(service.repoUrl('Bitbucket', slug), `${vcsEndpoints.bitbucket}/${slug}`);
  });

  test('branchUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branch = 'branch';

    assert.equal(service.branchUrl('Github', slug, branch), `${vcsEndpoints.github}/${slug}/tree/${branch}`);
    assert.equal(service.branchUrl('Bitbucket', slug, branch), `${vcsEndpoints.bitbucket}/${slug}/src/${branch}`);
  });

  test('tagUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const tag = 'tag';

    assert.equal(service.tagUrl('Github', slug, tag), `${vcsEndpoints.github}/${slug}/releases/tag/${tag}`);
    assert.equal(service.tagUrl('Bitbucket', slug, tag), `${vcsEndpoints.bitbucket}/${slug}/src/${tag}`);
  });

  test('commitUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const sha = 'sha';

    assert.equal(service.commitUrl('Github', slug, sha), `${vcsEndpoints.github}/${slug}/commit/${sha}`);
    assert.equal(service.commitUrl('Bitbucket', slug, sha), `${vcsEndpoints.bitbucket}/${slug}/commits/${sha}`);
  });

  test('fileUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branch = 'branch';
    const file = 'file';

    assert.equal(service.fileUrl('Github', slug, branch, file), `${vcsEndpoints.github}/${slug}/blob/${branch}/${file}`);
    assert.equal(service.fileUrl('Bitbucket', slug, branch, file), `${vcsEndpoints.bitbucket}/${slug}/src/${branch}/${file}`);
  });

  test('issueUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const issueNumber = '123';

    assert.equal(service.issueUrl('Github', slug, issueNumber), `${vcsEndpoints.github}/${slug}/issues/${issueNumber}`);
    assert.equal(service.issueUrl('Bitbucket', slug, issueNumber), `${vcsEndpoints.bitbucket}/${slug}/issues/${issueNumber}`);
  });

  test('profileUrl', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const username = 'username';

    assert.equal(service.profileUrl('Github', username), `${vcsEndpoints.github}/${username}`);
    assert.equal(service.profileUrl('Bitbucket', username), `${vcsEndpoints.bitbucket}/${username}`);
  });
});
