import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | repo/request configs', function (hooks) {
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
        source: 'test/test_repo:.travis.yml@master',
        config: 'script: echo "Hello World"'
      }],
      config: { script: 'echo "Hello World"' },
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

    this.testTargets = {
      url: `/adal/difference-engine/builds/${this.latestBuild.id}/config`
    };
  });

  test('view request configs view', async function (assert) {
    await visit(this.testTargets.url);

    percySnapshot(assert);
    assert.dom('[data-test-request-configs-button-cancel]').exists();
    assert.dom('[data-test-request-configs-button-customize]').exists();
    assert.dom('[data-test-request-configs-button-preview]').exists();
    assert.dom('[data-test-request-configs-submit]').exists();
    assert.dom('[data-test-raw-configs]').exists({ count: 1 });
    assert.dom('[data-test-request-config]').doesNotExist();
    assert.dom('[data-test-file-path]').hasText('test/test_repo:.travis.yml@master');
    assert.dom('[data-test-trigger-build-description]').hasAnyText('Trigger a build request with the following');
  });

  test('click on cancel button', async function (assert) {
    await visit(this.testTargets.url);

    await click('[data-test-request-configs-button-cancel]');

    percySnapshot(assert);
    assert.dom('[data-test-request-configs-button-customize]').doesNotExist();
    assert.dom('[data-test-request-configs-button-preview]').doesNotExist();
    assert.dom('[data-test-trigger-build-description]').doesNotExist();
    assert.dom('[data-test-request-config]').exists();
    assert.dom('[data-test-json]').hasText('{ "script": "echo \\"Hello World\\"" }');
  });

  test('customize config', async function (assert) {
    await visit(this.testTargets.url);

    await click('[data-test-request-configs-button-customize]');

    percySnapshot(assert);
    assert.dom('[data-test-build-config-form]').exists();

    await fillIn('[data-test-build-config-form] input', 'This is a demo build'),
    await fillIn('[data-test-build-config-form] textarea', 'script: echo "Hello World"');

    click('[data-test-request-configs-submit]');
    percySnapshot(assert);

    assert.ok('[data-test-build-config-form]', 'config form is hidden again');
  });
});
