import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | vcs-links', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.repo = {
      slug: 'travis-ci/travis-web',
      vcsType: 'GithubRepository',
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
});
