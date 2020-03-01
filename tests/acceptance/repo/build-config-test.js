import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo/trigger build', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', {
      name: 'Ada Lovelace',
      login: 'adal',
    });

    signInUser(this.currentUser);

    this.repo = this.server.create('repository', {
      name: 'difference-engine',
      slug: 'adal/difference-engine',
      permissions: {
        create_request: true
      }
    });
    const repoId = parseInt(this.repo.id);

    const request = this.server.create('request', {
      repository: this.repo,
      pull_request_mergeable: 'draft',
      raw_configs: [{
        source: 'emmanuel-ci/test_repo:.travis.yml@master',
        config: 'script: echo \"Hello World\"'
      }],
      branch_name: 'master'
    });

    request.createCommit({
      sha: 'c0ffee',
      message: 'Initial commit'
    });

    const defaultBranch = this.server.create('branch', {
      name: 'master',
      id: `/v3/repo/${repoId}/branch/master`,
      default_branch: true,
      exists_on_github: true,
      repository: this.repo
    });

    const latestBuild = defaultBranch.createBuild({
      state: 'passed',
      number: '1234',
      repository: this.repo,
      request
    });

    let commit = latestBuild.createCommit({
      sha: 'c0ffee'
    });

    latestBuild.createJob({
      id: 100,
      repository: this.repo,
      build: latestBuild,
      commit,
      number: '15.1',
      state: 'created',
    });


    this.server.create('branch', {
      name: 'deleted',
      id: `/v3/repo/${repoId}/branch/deleted`,
      default_branch: false,
      exists_on_github: false,
      repository: this.repo
    });

    this.latestBuild = latestBuild;
    this.repo.currentBuild = this.latestBuild;
    this.repo.save();
  });

  test('trigger', async function (assert) {
    await visit(`/adal/difference-engine/builds/${this.latestBuild.id}/config`);
    assert.dom('[request-configs-button-cancel]').exists();
    assert.dom('[request-configs-button-customize]').exists();
    assert.dom('[request-configs-button-preview]').exists();
    assert.dom('[data-test-request-configs-submit]').exists();
    assert.dom('[data-test-raw-configs]').exists();
    assert.dom('.option-dropdown [trigger-build-anchor]').exists();
    assert.dom('[trigger-build-description]').hasAnyText('Trigger a build request with the following');
  });
});
