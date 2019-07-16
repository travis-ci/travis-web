import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | vcs-links', function (hooks) {
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

  test('endpoint', function (assert) {
    const service = this.owner.lookup('service:vcs-links');

    assert.equal(service.endpoint(), 'https://github.com');
    assert.equal(service.endpoint('GithubRepository'), 'https://github.com');
  });

  test('repoUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');

    assert.equal(service.repoUrl(this.repo.vcsType, this.repo.slug), 'https://github.com/travis-ci/travis-web');
  });

  test('branchUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');
    const { vcsType, slug } = this.repo;

    assert.equal(service.branchUrl(vcsType, slug, this.build.branch), 'https://github.com/travis-ci/travis-web/tree/new-pr');
  });

  test('tagUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');
    const { vcsType, slug } = this.repo;

    assert.equal(service.tagUrl(vcsType, slug, '2.0.0'), 'https://github.com/travis-ci/travis-web/releases/tag/2.0.0');
  });

  test('commitUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');
    const { vcsType, slug } = this.repo;

    assert.equal(service.commitUrl(vcsType, slug, this.commit.sha), 'https://github.com/travis-ci/travis-web/commit/123abc');
  });
});
