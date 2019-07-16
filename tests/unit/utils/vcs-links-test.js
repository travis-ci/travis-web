import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import vcsLinks from 'travis/utils/vcs-links';

module('Unit | Utility | vcs-links', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.repo = {
      slug: 'travis-ci/travis-web',
      vcsType: 'GithubRepository',
    };

    this.build = {
      branch: 'new-pr',
    };

    this.commit = {
      sha: '123abc',
    };
  });

  test('repoUrl', function (assert) {
    assert.equal(vcsLinks.repoUrl(this.repo.vcsType, this.repo.slug), 'https://github.com/travis-ci/travis-web');
  });

  test('branchUrl', function (assert) {
    const { vcsType, slug } = this.repo;

    assert.equal(vcsLinks.branchUrl(vcsType, slug, this.build.branch), 'https://github.com/travis-ci/travis-web/tree/new-pr');
  });

  test('tagUrl', function (assert) {
    const { vcsType, slug } = this.repo;

    assert.equal(vcsLinks.tagUrl(vcsType, slug, '2.0.0'), 'https://github.com/travis-ci/travis-web/releases/tag/2.0.0');
  });

  test('commitUrl', function (assert) {
    const { vcsType, slug } = this.repo;

    assert.equal(vcsLinks.commitUrl(vcsType, slug, this.commit.sha), 'https://github.com/travis-ci/travis-web/commit/123abc');
  });

  test('fileUrl', function (assert) {
    const { vcsType, slug } = this.repo;

    assert.equal(vcsLinks.fileUrl(vcsType, slug, this.build.branch, 'file'), 'https://github.com/travis-ci/travis-web/blob/new-pr/file');
  });
});
