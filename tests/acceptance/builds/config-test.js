import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import {
  TRIGGER_BUILD_BUTTON,
  CANCEL_BUTTON,
  CUSTOMIZE_BUTTON,
  PREVIEW_BUTTON,
  RAW_CONFIGS,
  REQUEST_CONFIG,
  TRIGGER_BUILD_NOTICE,
  CONFIG_SOURCE,
  BUILD_CONFIG_FORM,
  BUILD_CONFIG_FORM_MESSAGE,
  BUILD_CONFIG_FORM_SCRIPT,
  PREVIEW_REQUEST_CONFIG,
  PREVIEW_JOB_CONFIGS,
  CONFIG_MESSAGES,
  CONFIG_MESSAGES_TOGGLE,
  CONFIG_MESSAGES_SUMMARY,
  CONFIG_MESSAGE_LINE,
} from 'travis/tests/helpers/selectors';

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
      config_validation: true,
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
      },
      {
        source: 'api',
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

    this.URL = `/adal/difference-engine/builds/${latestBuild.id}/config`;
    this.repo.currentBuild = latestBuild;
    this.repo.save();
  });

  test('closed', async function (assert) {
    await visit(this.URL);

    percySnapshot(assert);

    assert.dom(TRIGGER_BUILD_BUTTON).exists();
    assert.dom(CANCEL_BUTTON).doesNotExist();
    assert.dom(CUSTOMIZE_BUTTON).doesNotExist();
    assert.dom(PREVIEW_BUTTON).doesNotExist();
    assert.dom(RAW_CONFIGS).exists({ count: 2 });
    assert.dom(REQUEST_CONFIG).exists({ count: 1 });
    assert.dom(CONFIG_SOURCE).hasText('test/test_repo:.travis.yml@master');
  });

  test('open', async function (assert) {
    await visit(this.URL);

    assert.dom(TRIGGER_BUILD_BUTTON).exists();
    await click(TRIGGER_BUILD_BUTTON);

    percySnapshot(assert);
    assert.dom(CANCEL_BUTTON).exists();
    assert.dom(CUSTOMIZE_BUTTON).exists();
    assert.dom(PREVIEW_BUTTON).exists();
    assert.dom(RAW_CONFIGS).exists({ count: 2 });
    assert.dom(REQUEST_CONFIG).exists();
    assert.dom(CONFIG_SOURCE).hasText('test/test_repo:.travis.yml@master');
    assert.dom(TRIGGER_BUILD_NOTICE).hasAnyText('Trigger a build request with the following');
  });

  test('click on cancel button', async function (assert) {
    await visit(this.URL);
    await click(TRIGGER_BUILD_BUTTON);
    await click(CANCEL_BUTTON);

    percySnapshot(assert);
    assert.dom(CUSTOMIZE_BUTTON).doesNotExist();
    assert.dom(PREVIEW_BUTTON).doesNotExist();
    assert.dom(TRIGGER_BUILD_NOTICE).doesNotExist();
    assert.dom(REQUEST_CONFIG).exists();
    assert.dom(REQUEST_CONFIG).hasAnyText('{ "script": "echo \\"Hello World\\"" }');
  });

  test('customizing', async function (assert) {
    await visit(this.URL);
    await click(TRIGGER_BUILD_BUTTON);
    await click(CUSTOMIZE_BUTTON);

    assert.dom(BUILD_CONFIG_FORM).exists();

    await fillIn(BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(BUILD_CONFIG_FORM_SCRIPT, 'script: echo "Hello World"');
    percySnapshot(assert);

    await click(TRIGGER_BUILD_BUTTON);
    assert.ok(BUILD_CONFIG_FORM, 'config form is hidden again');
  });

  test('customizing, invalid config', async function (assert) {
    await visit(this.URL);
    await click(TRIGGER_BUILD_BUTTON);
    await click(CUSTOMIZE_BUTTON);

    assert.dom(BUILD_CONFIG_FORM).exists();

    await fillIn(BUILD_CONFIG_FORM_MESSAGE, 'This is a demo build'),
    await fillIn(BUILD_CONFIG_FORM_SCRIPT, 'invalid');

    assert.dom(CONFIG_MESSAGES).exists({ count: 1 });
    await click(CONFIG_MESSAGES);
    assert.ok(CONFIG_MESSAGES_SUMMARY, 'Validation:  error — 1 error');
    assert.ok(CONFIG_MESSAGE_LINE, 'invalid config format (must be a hash)');
    percySnapshot(assert);
  });

  test('previewing', async function (assert) {
    await visit(this.URL);
    await click(TRIGGER_BUILD_BUTTON);
    await click(PREVIEW_BUTTON);

    percySnapshot(assert);

    assert.dom(PREVIEW_REQUEST_CONFIG).hasText('{ "language": "node_js", "os": [ "linux" ] }');
    assert.dom(PREVIEW_JOB_CONFIGS).hasText('{ "os": "linux", "language": "node_js" }');

    assert.dom(CONFIG_MESSAGES).exists({ count: 1 });
    await click(CONFIG_MESSAGES_TOGGLE);
    assert.dom(CONFIG_MESSAGE_LINE).hasText('root: missing os, using the default linux');
  });
});
