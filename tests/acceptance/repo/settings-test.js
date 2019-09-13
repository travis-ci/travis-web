import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { Response } from 'ember-cli-mirage';
import { percySnapshot } from 'ember-percy';
import settingsPage from 'travis/tests/pages/settings';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';

import moment from 'moment';

module('Acceptance | repo settings', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    await signInUser(currentUser);

    // create organization
    server.create('organization', {
      name: 'Org Name',
      login: 'org-login',
    });

    const repository = server.create('repository', {
      name: 'repository-name',
      slug: 'org-login/repository-name',
      private: true
    });
    repository.attrs.permissions.create_cron = true;

    repository.createSetting({ name: 'builds_only_with_travis_yml', value: true });
    repository.createSetting({ name: 'build_pushes', value: true });
    repository.createSetting({ name: 'maximum_number_of_builds', value: 1919 });
    repository.createSetting({ name: 'build_pull_requests', value: true });

    repository.createEnvVar({
      id: 'b',
      name: 'published',
      public: null,
      value: null
    });

    repository.createEnvVar({
      id: 'a',
      name: 'intersectionality',
      public: true,
      value: 'Kimberlé Crenshaw'
    });

    this.repository = repository;

    const repoId = parseInt(repository.id);

    const dailyBranch = server.create('branch', {
      name: 'daily-branch',
      id: `/v3/repo/${repoId}/branch/daily-branch`,
      exists_on_github: true,
      repository
    });

    const weeklyBranch = server.create('branch', {
      name: 'weekly-branch',
      id: `/v3/repo/${repoId}/branch/weekly-branch`,
      exists_on_github: true,
      repository
    });

    this.dailyCron = server.create('cron', {
      interval: 'daily',
      dont_run_if_recent_build_exists: false,
      last_run: moment(),
      next_run: moment().add(1, 'days'),
      branchId: dailyBranch.id,
      repository
    });

    server.create('cron', {
      interval: 'weekly',
      dont_run_if_recent_build_exists: true,
      last_run: moment(),
      next_run: moment().add(1, 'weeks'),
      branchId: weeklyBranch.id,
      repository
    });
  });

  test('view settings', async function (assert) {
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.ok(settingsPage.buildPushes.isActive, 'expected builds for pushes');
    assert.equal(settingsPage.buildPushes.ariaChecked, 'true', 'expected the build pushes switch to have aria-checked=true');
    assert.equal(settingsPage.buildPushes.role, 'switch', 'expected the build pushes switch to be marked as such');

    assert.ok(settingsPage.limitConcurrentBuilds.isActive, 'expected concurrent builds to be limited');
    assert.equal(settingsPage.limitConcurrentBuilds.value, '1919');

    assert.ok(settingsPage.buildPullRequests.isActive, 'expected builds for pull requests');

    settingsPage.environmentVariables[0].as(environmentVariable => {
      assert.equal(environmentVariable.name, 'intersectionality');
      assert.ok(environmentVariable.isPublic, 'expected environment variable to be public');
      assert.notOk(environmentVariable.isNewlyCreated, 'expected existing variable to not be newly created');
      assert.equal(environmentVariable.value, 'Kimberlé Crenshaw');
    });

    settingsPage.environmentVariables[1].as(environmentVariable => {
      assert.equal(environmentVariable.name, 'published');
      assert.notOk(environmentVariable.isPublic, 'expected environment variable to not be public');
      assert.equal(environmentVariable.value, '••••••••••••••••');
    });

    settingsPage.crons[0].as(cron => {
      assert.equal(cron.branchName.text, 'daily-branch');
      assert.equal(cron.branchName.title, cron.branchName.text);

      assert.equal(cron.interval, 'Runs daily');

      assert.equal(cron.lastRun.text, 'Ran less than a minute ago');
      assert.equal(cron.lastRun.title, this.dailyCron.last_run.toISOString());

      assert.equal(cron.nextRun.text, 'Scheduled in about 24 hours from now');
      assert.equal(cron.nextRun.title, this.dailyCron.next_run.toISOString());

      assert.ok(cron.dontRunIfRecentBuildExists.text.indexOf('Always run') === 0, 'expected cron to run even if there is a build in the last 24h');
      assert.equal(cron.dontRunIfRecentBuildExists.title, 'Always run');
    });

    settingsPage.crons[1].as(cron => {
      assert.equal(cron.branchName.text, 'weekly-branch');
      assert.equal(cron.interval, 'Runs weekly');
      assert.equal(cron.lastRun.text, 'Ran less than a minute ago');
      assert.equal(cron.nextRun.text, 'Scheduled in 7 days from now');
      assert.ok(cron.dontRunIfRecentBuildExists.text.indexOf('Do not run if there has been a build in the last 24h') === 0, 'expected Do not run if there has been a build in the last 24h');
    });

    assert.equal(settingsPage.sshKey.name, 'Custom');
    assert.equal(settingsPage.sshKey.fingerprint, 'dd:cc:bb:aa');

    assert.notOk(settingsPage.autoCancellationSection.exists, 'expected auto-cancellation section to not exist');
    assert.notOk(settingsPage.autoCancelPushes.exists, 'expected no auto-cancel pushes switch when flag not present in API response');
    assert.notOk(settingsPage.autoCancelPullRequests.exists, 'expected no auto-cancel pull requests switch when flag not present in API response');
  });

  test('change general settings', async function (assert) {
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    const settingToRequestBody = {};

    server.patch(`/repo/${this.repository.id}/setting/:setting`, function (schema, request) {
      settingToRequestBody[request.params.setting] = JSON.parse(request.requestBody);
    });

    await settingsPage.buildPushes.toggle();

    assert.notOk(settingsPage.buildPushes.isActive, 'expected no builds for pushes');
    assert.equal(settingsPage.buildPushes.ariaChecked, 'false', 'expected the build pushes switch to have aria-checked=false');
    assert.deepEqual(settingToRequestBody.build_pushes, { 'setting.value': false });

    await settingsPage.buildPullRequests.toggle();

    assert.notOk(settingsPage.buildPullRequests.isActive, 'expected no builds for pull requests');
    assert.deepEqual(settingToRequestBody.build_pull_requests, { 'setting.value': false });

    await settingsPage.limitConcurrentBuilds.fill('2010');

    assert.equal(settingsPage.limitConcurrentBuilds.value, '2010');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'setting.value': 2010 });

    await settingsPage.limitConcurrentBuilds.toggle();

    assert.notOk(settingsPage.limitConcurrentBuilds.isActive, 'expected unlimited concurrent builds');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'setting.value': 0 });
  });

  test('delete and create environment variables', async function (assert) {
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    const deletedIds = [];

    server.delete('/settings/env_vars/:id', function (schema, request) {
      deletedIds.push(request.params.id);
    });

    await settingsPage.environmentVariables[0].delete();

    assert.equal(deletedIds.pop(), 'a', 'expected the server to have received a deletion request for the first environment variable');
    assert.equal(settingsPage.environmentVariables.length, 1, 'expected only one environment variable to remain');
    assert.equal(settingsPage.environmentVariables[0].name, 'published', 'expected the formerly-second variable to be first');

    let requestBodies = [];

    server.post('/settings/env_vars', function (schema, request) {
      const parsedRequestBody = JSON.parse(request.requestBody);
      parsedRequestBody.env_var.id = '1919';
      requestBodies.push(parsedRequestBody);
      return parsedRequestBody;
    });

    await settingsPage.environmentVariableForm.fillName('  drafted');
    await settingsPage.environmentVariableForm.fillValue('  true');
    await settingsPage.environmentVariableForm.makePublic();
    await settingsPage.environmentVariableForm.add();

    settingsPage.environmentVariables[0].as(environmentVariable => {
      assert.equal(environmentVariable.name, 'drafted', 'expected leading whitespace to be trimmed');
      assert.ok(environmentVariable.isPublic, 'expected environment variable to be public');
      assert.ok(environmentVariable.isNewlyCreated, 'expected environment variable to be newly created');
      assert.equal(environmentVariable.value, 'true', 'expected leading whitespace to be trimmed');
    });

    assert.deepEqual(requestBodies.pop(), { env_var: {
      id: '1919',
      name: 'drafted',
      value: 'true',
      public: true,
      branch: null,
      repository_id: this.repository.id
    } });

    // This will save env var with branch
    requestBodies = [];

    server.post('/settings/env_vars', function (schema, request) {
      const parsedRequestBody = JSON.parse(request.requestBody);
      parsedRequestBody.env_var.id = '1920';
      requestBodies.push(parsedRequestBody);
      return parsedRequestBody;
    });

    let branchName = 'foo';

    server.create('branch', {
      name: branchName,
      id: `/v3/repo/${this.repository.id}/branch/food`,
      exists_on_github: true,
      repository: this.repository,
    });

    await settingsPage.environmentVariableForm.fillName('envname');
    await settingsPage.environmentVariableForm.fillValue('envvalue');
    await selectSearch('.env-branch-selector', branchName);
    await selectChoose('.env-branch-selector', branchName);
    await settingsPage.environmentVariableForm.makePublic();
    await settingsPage.environmentVariableForm.add();

    settingsPage.environmentVariables[0].as(environmentVariable => {
      assert.ok(environmentVariable.isNewlyCreated, 'expected environment variable to be newly created');
    });

    assert.deepEqual(requestBodies.pop(), { env_var: {
      id: '1920',
      name: 'envname',
      value: 'envvalue',
      public: true,
      branch: branchName,
      repository_id: this.repository.id
    } });

    // This will trigger a client-side error
    server.post('/settings/env_vars', () => new Response(403, {}, {}));

    await settingsPage.environmentVariableForm.fillName('willFail');
    await settingsPage.environmentVariableForm.fillValue('true');
    await settingsPage.environmentVariableForm.add();

    assert.equal(topPage.flashMessage.text, 'There was an error saving this environment variable.');

    // This will cause deletions to fail
    server.delete('/settings/env_vars/:id', () => new Response(500, {}, {}));

    await settingsPage.environmentVariables[1].delete();

    assert.equal(settingsPage.environmentVariables.length, 3, 'expected the environment variable to remain');
    assert.equal(topPage.flashMessage.text, 'There was an error deleting this environment variable.');

    server.delete('/settings/env_vars/:id', () => new Response(404, {}, {}));

    await settingsPage.environmentVariables[1].delete();

    assert.equal(settingsPage.environmentVariables.length, 3, 'expected the environment variable to remain');
    assert.equal(topPage.flashMessage.text, 'This environment variable has already been deleted. Try refreshing.');
  });

  test('delete and create crons', async function (assert) {
    const done = assert.async();

    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    const deletedIds = [];

    server.delete('/cron/:id', function (schema, request) {
      deletedIds.push(request.params.id);
      schema.db.crons.remove(request.params.id);
      return {};
    });

    await settingsPage.crons[0].delete();

    assert.equal(deletedIds.pop(), this.dailyCron.id, 'expected the server to have received a deletion request for the first cron');
    assert.equal(settingsPage.crons.length, 1, 'expected only one cron to remain');
    done();
  });

  test('create a new cron', async function (assert) {
    let branchName = 'foo';

    server.create('branch', {
      name: branchName,
      id: `/v3/repo/${this.repository.id}/branch/food`,
      exists_on_github: true,
      repository: this.repository,
    });

    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });
    await selectSearch(settingsPage.cronBranchSelect.scope, branchName);
    await selectChoose(settingsPage.cronBranchSelect.scope, branchName);
    await settingsPage.addCronSubmit.click();

    assert.equal(settingsPage.crons.length, 3, 'expected to load all existed crons');
  });

  test('delete SSH key', async function (assert) {
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    const deletedIds = [];

    server.delete('/settings/ssh_key/:id', function (schema, request) {
      deletedIds.push(request.params.id);
    });

    await settingsPage.sshKey.delete();

    assert.equal(deletedIds.pop(), this.repository.id, 'expected the server to have received a deletion request for the SSH key');

    assert.equal(settingsPage.sshKey.name, 'Default');
    assert.equal(settingsPage.sshKey.fingerprint, 'aa:bb:cc:dd');
    assert.ok(settingsPage.sshKey.cannotBeDeleted, 'expected default SSH key not to be deletable');
  });

  test('add SSH key', async function (assert) {
    server.schema.db.sshKeys.remove();

    const requestBodies = [];

    server.get(`/settings/ssh_key/${this.repository.id}`, function (schema, request) {
      return new Response(429, {}, {});
    });

    server.patch(`/settings/ssh_key/${this.repository.id}`, (schema, request) => {
      const newKey = JSON.parse(request.requestBody);
      requestBodies.push(newKey);
      newKey.id = this.repository.id;

      return {
        ssh_key: newKey
      };
    });

    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    await settingsPage.sshKeyForm.fillDescription('hey');
    await settingsPage.sshKeyForm.fillKey('hello');
    await settingsPage.sshKeyForm.add();

    assert.deepEqual(requestBodies.pop().ssh_key, {
      id: this.repository.id,
      description: 'hey',
      value: 'hello'
    });
  });

  test('the SSH key section is hidden for public repositories', async function (assert) {
    this.repository.private = false;
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.dom('[data-test-ssh-key-section]').doesNotExist();
  });

  test('shows disabled modal message for migrated repository on .org', async function (assert) {
    this.repository.update('migration_status', 'migrated');
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.dom('[data-test-settings-disabled-after-migration-modal]').exists();
  });

  test('when repository is private and allow_config_imports setting is present', async function (assert) {
    this.repository.private = true;
    this.repository.createSetting({ name: 'allow_config_imports', value: true });

    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.ok(settingsPage.configImportsSection.exists, 'expected auto-cancellation section to exist');
    assert.ok(settingsPage.allowConfigImports.isActive, 'expected allow_config_imports pushes to be present and enabled');

    const settingToRequestBody = {};

    server.patch(`/repo/${this.repository.id}/setting/:setting`, function (schema, request) {
      settingToRequestBody[request.params.setting] = JSON.parse(request.requestBody);
    });

    await settingsPage.allowConfigImports.toggle();
    assert.notOk(settingsPage.allowConfigImports.isActive, 'expected  allow_config_imports to be disabled');
  });

  test('when repository is private and allow_config_imports setting is not present', async function (assert) {
    this.repository.private = true;
    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.notOk(settingsPage.configImportsSection.exists, 'expected auto-cancellation section to exist');
  });

  test('on a repository with auto-cancellation', async function (assert) {
    this.repository.createSetting({ name: 'auto_cancel_pushes', value: true });
    this.repository.createSetting({ name: 'auto_cancel_pull_requests', value: false });

    await settingsPage.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.ok(settingsPage.autoCancellationSection.exists, 'expected auto-cancellation section to exist');
    assert.ok(settingsPage.autoCancelPushes.isActive, 'expected auto-cancel pushes to be present and enabled');
    assert.notOk(settingsPage.autoCancelPullRequests.isActive, 'expected auto-cancel pull requests to be present but disabled');

    const settingToRequestBody = {};

    server.patch(`/repo/${this.repository.id}/setting/:setting`, function (schema, request) {
      settingToRequestBody[request.params.setting] = JSON.parse(request.requestBody);
    });

    await settingsPage.autoCancelPullRequests.toggle();

    assert.ok(settingsPage.autoCancelPullRequests.isActive, 'expected auto-cancel pull requests to be enabled');
    assert.deepEqual(settingToRequestBody.auto_cancel_pull_requests, { 'setting.value': true });

    await settingsPage.autoCancelPushes.toggle();

    assert.notOk(settingsPage.autoCancelPushes.isActive, 'expected auto-cancel pushes to be disabled');
    assert.deepEqual(settingToRequestBody.auto_cancel_pushes, { 'setting.value': false });

    percySnapshot(assert);
  });
});
