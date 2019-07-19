import { module, test } from 'qunit';
import vcsLinks, { endpoints, vcsUrl } from 'travis/utils/vcs-links';

module('Unit | Utility | vcs-links', function () {
  test('endpoints', function (assert) {
    assert.equal(endpoints.github, 'https://github.com');
  });

  test('vcsUrl', function (assert) {
    const paths = {
      github: '/somepath',
    };

    assert.throws(vcsUrl, 'Throws if cannot find vcs');
    assert.throws(() => vcsUrl('Github'), 'Throws if cannot find path');

    assert.equal(vcsUrl(null, paths), 'https://github.com/somepath', 'Defaults to Github');
    assert.equal(vcsUrl('GithubRepository', paths), 'https://github.com/somepath');
  });

  test('repoUrl', function (assert) {
    assert.equal(vcsLinks.repoUrl('GithubRepository', 'travis-ci/travis-web'), 'https://github.com/travis-ci/travis-web');
  });

  test('branchUrl', function (assert) {
    assert.equal(vcsLinks.branchUrl('GithubRepository', 'travis-ci/travis-web', 'new-pr'), 'https://github.com/travis-ci/travis-web/tree/new-pr');
  });

  test('tagUrl', function (assert) {
    assert.equal(vcsLinks.tagUrl('GithubRepository', 'travis-ci/travis-web', '2.0.0'), 'https://github.com/travis-ci/travis-web/releases/tag/2.0.0');
  });

  test('commitUrl', function (assert) {
    assert.equal(vcsLinks.commitUrl('GithubRepository', 'travis-ci/travis-web', '123abc'), 'https://github.com/travis-ci/travis-web/commit/123abc');
  });

  test('fileUrl', function (assert) {
    assert.equal(vcsLinks.fileUrl('GithubRepository', 'travis-ci/travis-web', 'new-pr', 'file'), 'https://github.com/travis-ci/travis-web/blob/new-pr/file');
  });

  test('issueUrl', function (assert) {
    assert.equal(vcsLinks.issueUrl('GithubRepository', 'travis-ci/travis-web', '123'), 'https://github.com/travis-ci/travis-web/issues/123');
  });

  test('profileUrl', function (assert) {
    assert.equal(vcsLinks.profileUrl('GithubUser', 'username'), 'https://github.com/username');
  });

  test('appsActivationUrl', function (assert) {
    assert.equal(vcsLinks.appsActivationUrl('Github', 'appName', 'vcsId'), 'https://github.com/apps/appName/installations/new/permissions?suggested_target_id=vcsId');
  });
});
