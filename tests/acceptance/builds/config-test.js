import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | build/config', function (hooks) {
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
      TRIGGER_BUILD_BUTTON: '[data-test-request-configs-trigger-build]',
      CANCEL_BUTTON: '[data-test-request-configs-button-cancel]',
      CUSTOMIZE_BUTTON: '[data-test-request-configs-button-customize]',
      PREVIEW_BUTTON: '[data-test-request-configs-button-preview]',
      RAW_CONFIGS: '[data-test-raw-config]',
      REQUEST_CONFIG: '[data-test-request-config]',
      CONFIG_SOURCE: '[data-test-config-source]',
      TRIGGER_BUILD_NOTICE: '[data-test-trigger-build-notice]',
      BUILD_CONFIG_FORM: '[data-test-build-config-form]',
      BUILD_CONFIG_FORM_MESSAGE: '[data-test-build-config-form] input',
      BUILD_CONFIG_FORM_SCRIPT: '[data-test-build-config-form] textarea',
      PREVIEW_CONFIG: '[data-test-preview-config]',
      PREVIEW_MATRIX: '[data-test-preview-matrix]',
      CONFIG_MESSAGES: '[data-test-configs-messages]',
      CONFIG_MESSAGES_SUMMARY: '[data-test-config-messages-summary]',
      CONFIG_MESSAGES_TOGGLE: '[data-test-config-messages-toggle]',
      CONFIG_MESSAGE_LINE: '[data-test-config-message-line]',
    };
  });

  test('closed', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON).exists();
    // assert.dom(this.TEST_TARGETS.CANCEL_BUTTON).doesNotExist();
    // assert.dom(this.TEST_TARGETS.CUSTOMIZE_BUTTON).doesNotExist();
    // assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).doesNotExist();
    assert.dom(this.TEST_TARGETS.RAW_CONFIGS).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIG).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.CONFIG_SOURCE).hasText('test/test_repo:.travis.yml@master');
  });

  test('open', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);

    assert.dom(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON).exists();
    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.CANCEL_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.CUSTOMIZE_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).exists();
    assert.dom(this.TEST_TARGETS.RAW_CONFIGS).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIG).exists();
    assert.dom(this.TEST_TARGETS.CONFIG_SOURCE).hasText('test/test_repo:.travis.yml@master');
    assert.dom(this.TEST_TARGETS.TRIGGER_BUILD_NOTICE).hasAnyText('Trigger a build request with the following');
  });

  test('click on cancel button', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);
    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);
    await click(this.TEST_TARGETS.CANCEL_BUTTON);

    percySnapshot(assert);
    // assert.dom(this.TEST_TARGETS.CUSTOMIZE_BUTTON).doesNotExist();
    // assert.dom(this.TEST_TARGETS.PREVIEW_BUTTON).doesNotExist();
    // assert.dom(this.TEST_TARGETS.TRIGGER_BUILD_NOTICE).doesNotExist();
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIG).exists();
    assert.dom(this.TEST_TARGETS.REQUEST_CONFIG).hasAnyText('{ "script": "echo \\"Hello World\\"" }');
  });

  test('customizing', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);
    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);
    await click(this.TEST_TARGETS.CUSTOMIZE_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.BUILD_CONFIG_FORM).exists();

    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_SCRIPT, 'script: echo "Hello World"');

    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);
    percySnapshot(assert);

    assert.ok(this.TEST_TARGETS.BUILD_CONFIG_FORM, 'config form is hidden again');
  });

  test('customizing, invalid config', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);
    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);
    await click(this.TEST_TARGETS.CUSTOMIZE_BUTTON);

    percySnapshot(assert);
    assert.dom(this.TEST_TARGETS.BUILD_CONFIG_FORM).exists();

    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(this.TEST_TARGETS.BUILD_CONFIG_FORM_SCRIPT, 'invalid');
    await click(this.TEST_TARGETS.CONFIG_MESSAGES);

    percySnapshot(assert);
    assert.ok(this.TEST_TARGETS.VALIDATION_RESULT_SUMMARY, 'Validation:  error — 1 error');
    assert.ok(this.TEST_TARGETS.CONFIG_MESSAGE_LINE, 'invalid config format (must be a hash)');
  });

  test('previewing', async function (assert) {
    enableFeature('show-new-config-view');
    await visit(this.TEST_TARGETS.URL);
    await click(this.TEST_TARGETS.TRIGGER_BUILD_BUTTON);
    await click(this.TEST_TARGETS.PREVIEW_BUTTON);

    percySnapshot(assert);

    assert.dom(this.TEST_TARGETS.PREVIEW_CONFIG).hasText('{ "language": "node_js", "os": [ "linux" ] }');
    assert.dom(this.TEST_TARGETS.PREVIEW_MATRIX).hasText('[ { "os": "linux", "language": "node_js" } ]');

    await click(this.TEST_TARGETS.CONFIG_MESSAGES_TOGGLE);

    assert.dom(this.TEST_TARGETS.CONFIG_MESSAGES).exists({ count: 1 });
    assert.dom(this.TEST_TARGETS.CONFIG_MESSAGE_LINE).hasText('root: missing os, using the default linux');
  });
});
