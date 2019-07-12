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
      pullRequestNumber: '999',
      branch: 'new-pr',
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

  test('pullRequestUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');
    const { vcsType, slug } = this.repo;

    assert.equal(service.pullRequestUrl(vcsType, slug, this.build.pullRequestNumber), 'https://github.com/travis-ci/travis-web/pull/999');
  });

  test('branchUrl', function (assert) {
    const service = this.owner.lookup('service:vcs-links');
    const { vcsType, slug } = this.repo;

    assert.equal(service.branchUrl(vcsType, slug, this.build.branch), 'https://github.com/travis-ci/travis-web/tree/new-pr');
  });
});
