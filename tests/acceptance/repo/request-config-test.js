import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
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

    this.TEST_TARGETS = {
      URL: `/adal/difference-engine/builds/${this.latestBuild.id}/config`,
      CANCEL_BUTTON: '[data-test-request-configs-button-cancel]',
      CUSTOMIZE_BUTTON: '[data-test-request-configs-button-customize]',
      PREVIEW_BUTTON: '[data-test-request-configs-button-preview]',
      CONFIGS_SUBMIT_BUTTON: '[data-test-request-configs-submit]',
      RAW_CONFIGS: '[data-test-raw-configs]',
      REQUEST_CONFIGS: '[data-test-request-config]',
      FILE_PATH: '[data-test-file-path]',
      BUILDS_DESCRIPTION: '[data-test-trigger-build-description]',
      JSON: '[data-test-json]',
      BUILD_CONFIG_FORM: '[data-test-build-config-form]',
      BUILD_CONFIG_FORM_MESSAGE: '[data-test-build-config-form] input',
      BUILD_CONFIG_FORM_SCRIPT: '[data-test-build-config-form] textarea',
      PREVIEW_CONFIG: '[data-test-preview-config]',
      PREVIEW_MATRIX: '[data-test-preview-matrix]',
      CONFIG_MESSAGES: '[data-test-configs-message]',
      CONFIG_MESSAGE_LINE: '[data-test-message-line]',
      TOGGLE_MESSAGE: '[data-test-toggle-messages]',
      VALIDATION_RESULT: '[data-test-validation-result]',
      VALIDATION_RESULT_SUMMARY: '[data-test-validation-result-summary]'
    };
  });

  test('request configs view', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.CANCEL_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.CUSTOMIZE_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.CONFIGS_SUBMIT_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.RAW_CONFIGS).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIGS).doesNotExist();
    assert.dom(this.TEST_TARGETS.FILE_PATH).hasText('test/test_repo:.travis.yml@master');
    assert.dom(this.TEST_TARGETS.BUILDS_DESCRIPTION).hasAnyText('Trigger a build request with the following');
  });

  test('click on cancel button', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    await click(this.TEST_TARGETS.CANCEL_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.CUSTOMIZE_BUTTON).doesNotExist();
    assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).doesNotExist();
    assert.dom(this.TEST_TARGETS.BUILDS_DESCRIPTION).doesNotExist();
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIGS).exists();
    assert.dom(this.TEST_TARGETS.JSON).hasText('{ "script": "echo \\"Hello World\\"" }');
  });

  test('customize config', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    await click(this.TEST_TARGETS.CUSTOMIZE_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.BUILD_CONFIG_FORM).exists();

    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_SCRIPT, 'script: echo "Hello World"');

    click(this.TEST_TARGETS.CONFIGS_SUBMIT_BUTTON);
    percySnapshot(assert);

    assert.ok(this.TEST_TARGETS.BUILD_CONFIG_FORM, 'config form is hidden again');
  });

  test('customize invalid config', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    await click(this.TEST_TARGETS.CUSTOMIZE_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.BUILD_CONFIG_FORM).exists();

    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_SCRIPT, 'invalid');
    await click(this.TEST_TARGETS.VALIDATION_RESULT);

    percySnapshot(assert);
    assert.ok(this.TEST_TARGETS.VALIDATION_RESULT_SUMMARY, 'Validation:  error — 1 error');
    assert.ok(this.TEST_TARGETS.CONFIG_MESSAGE_LINE, 'invalid config format (must be a hash)');
  });

  test('preview config', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    await click(this.TEST_TARGETS.PREVIEW_BUTTON);

    percySnapshot(assert);

    assert.dom(this.TEST_TARGETS.PREVIEW_CONFIG).hasText('{ "language": "node_js", "os": [ "linux" ] }');
    assert.dom(this.TEST_TARGETS.PREVIEW_MATRIX).hasText('[ { "os": "linux", "language": "node_js" } ]');

    await click(this.TEST_TARGETS.TOGGLE_MESSAGE);

    assert.dom(this.TEST_TARGETS.CONFIG_MESSAGES).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.CONFIG_MESSAGE_LINE).hasText('root: missing os, using the default linux');
  });
});
