import { test } from 'qunit';
import { Response } from 'ember-cli-mirage';

import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import settingsPage from 'travis/tests/pages/settings';
import topPage from 'travis/tests/pages/top';

import moment from 'moment';

moduleForAcceptance('Acceptance | repo settings', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life',
      slug: 'killjoys/living-a-feminist-life',
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
  }
});

test('view settings', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(function () {
    assert.ok(settingsPage.buildOnlyWithTravisYml.isActive, 'expected builds only with .travis.yml');
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
      assert.equal(cron.branchName, 'Cron job event daily-branch');
      assert.equal(cron.interval, 'Runs daily');
      assert.equal(cron.lastRun, 'Ran less than a minute ago');
      assert.equal(cron.nextRun, 'Scheduled in about 24 hours from now');
      assert.ok(cron.dontRunIfRecentBuildExistsText.indexOf('Always run') === 0, 'expected cron to run even if there is a build in the last 24h');
    });

    settingsPage.crons[1].as(cron => {
      assert.equal(cron.branchName, 'Cron job event weekly-branch');
      assert.equal(cron.interval, 'Runs weekly');
      assert.equal(cron.lastRun, 'Ran less than a minute ago');
      assert.equal(cron.nextRun, 'Scheduled in 7 days from now');
      assert.ok(cron.dontRunIfRecentBuildExistsText.indexOf('Do not run if there has been a build in the last 24h') === 0, 'expected Do not run if there has been a build in the last 24h');
    });

    assert.equal(settingsPage.sshKey.name, 'Custom');
    assert.equal(settingsPage.sshKey.fingerprint, 'dd:cc:bb:aa');

    assert.notOk(settingsPage.autoCancellationSection.exists, 'expected auto-cancellation section to not exist');
    assert.notOk(settingsPage.autoCancelPushes.exists, 'expected no auto-cancel pushes switch when flag not present in API response');
    assert.notOk(settingsPage.autoCancelPullRequests.exists, 'expected no auto-cancel pull requests switch when flag not present in API response');
  });
});

test('change general settings', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const settingToRequestBody = {};

  server.patch(`/repo/${this.repository.id}/setting/:setting`, function (schema, request) {
    settingToRequestBody[request.params.setting] = JSON.parse(request.requestBody);
  });

  settingsPage.buildPushes.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildPushes.isActive, 'expected no builds for pushes');
    assert.equal(settingsPage.buildPushes.ariaChecked, 'false', 'expected the build pushes switch to have aria-checked=false');
    assert.deepEqual(settingToRequestBody.build_pushes, { 'setting.value': false });
  });

  settingsPage.buildOnlyWithTravisYml.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildOnlyWithTravisYml.isActive, 'expected builds without .travis.yml');
    assert.deepEqual(settingToRequestBody.builds_only_with_travis_yml, { 'setting.value': false });
  });

  settingsPage.buildPullRequests.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildPullRequests.isActive, 'expected no builds for pull requests');
    assert.deepEqual(settingToRequestBody.build_pull_requests, { 'setting.value': false });
  });

  settingsPage.limitConcurrentBuilds.fill('2010');

  andThen(() => {
    assert.equal(settingsPage.limitConcurrentBuilds.value, '2010');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'setting.value': 2010 });
  });

  settingsPage.limitConcurrentBuilds.toggle();

  andThen(() => {
    assert.notOk(settingsPage.limitConcurrentBuilds.isActive, 'expected unlimited concurrent builds');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'setting.value': 0 });
  });
});

test('delete and create environment variables', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/env_vars/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  settingsPage.environmentVariables[0].delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), 'a', 'expected the server to have received a deletion request for the first environment variable');
    assert.equal(settingsPage.environmentVariables.length, 1, 'expected only one environment variable to remain');
    assert.equal(settingsPage.environmentVariables[0].name, 'published', 'expected the formerly-second variable to be first');
  });

  const requestBodies = [];

  server.post('/settings/env_vars', function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    parsedRequestBody.env_var.id = '1919';
    requestBodies.push(parsedRequestBody);
    return parsedRequestBody;
  });

  settingsPage.environmentVariableForm.fillName('  drafted');
  settingsPage.environmentVariableForm.fillValue('  true');
  settingsPage.environmentVariableForm.makePublic();
  settingsPage.environmentVariableForm.add();

  andThen(() => {
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
      repository_id: this.repository.id
    } });

    // This will trigger a client-side error
    server.post('/settings/env_vars', () => new Response(403, {}, {}));
  });

  settingsPage.environmentVariableForm.fillName('willFail');
  settingsPage.environmentVariableForm.fillValue('true');
  settingsPage.environmentVariableForm.add();

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'There was an error saving this environment variable.');

    // This will cause deletions to fail
    server.delete('/settings/env_vars/:id', () => new Response(500, {}, {}));
  });

  settingsPage.environmentVariables[1].delete();

  andThen(() => {
    assert.equal(settingsPage.environmentVariables.length, 2, 'expected the environment variable to remain');
    assert.equal(topPage.flashMessage.text, 'There was an error deleting this environment variable.');

    server.delete('/settings/env_vars/:id', () => new Response(404, {}, {}));
  });

  settingsPage.environmentVariables[1].delete();

  andThen(() => {
    assert.equal(settingsPage.environmentVariables.length, 2, 'expected the environment variable to remain');
    assert.equal(topPage.flashMessage.text, 'This environment variable has already been deleted. Try refreshing.');
  });
});

test('delete and create crons', function (assert) {
  const done = assert.async();

  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/cron/:id', function (schema, request) {
    deletedIds.push(request.params.id);
    schema.db.crons.remove(request.params.id);
    return {};
  });

  settingsPage.crons[0].delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.dailyCron.id, 'expected the server to have received a deletion request for the first cron');
    assert.equal(settingsPage.crons.length, 1, 'expected only one cron to remain');
    done();
  });
});

test('reload cron branches on branch:created', function (assert) {
  const done = assert.async();

  server.create('branch', {
    name: 'food',
    id: `/v3/repo/${this.repository.id}/branch/food`,
    exists_on_github: true,
    repository: this.repository,
  });

  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(settingsPage.cronBranches.length, 1, 'expected only one branch');

    server.create('branch', {
      name: 'bar',
      id: `/v3/repo/${this.repository.id}/branch/bar`,
      exists_on_github: true,
      repository: this.repository,
    });

    this.application.pusher.receive('branch:created', {
      repository_id: this.repository.id,
      branch: 'bar',
    });
  });

  andThen(() => {
    assert.equal(settingsPage.cronBranches.length, 2, 'expected two branches after event');
    done();
  });
});

test('delete SSH key', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/ssh_key/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  settingsPage.sshKey.delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.repository.id, 'expected the server to have received a deletion request for the SSH key');

    assert.equal(settingsPage.sshKey.name, 'Default');
    assert.equal(settingsPage.sshKey.fingerprint, 'aa:bb:cc:dd');
    assert.ok(settingsPage.sshKey.cannotBeDeleted, 'expected default SSH key not to be deletable');
  });
});

test('add SSH key', function (assert) {
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

  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  settingsPage.sshKeyForm.fillDescription('hey');
  settingsPage.sshKeyForm.fillKey('hello');
  settingsPage.sshKeyForm.add();

  andThen(() => {
    assert.deepEqual(requestBodies.pop().ssh_key, {
      id: this.repository.id,
      description: 'hey',
      value: 'hello'
    });
  });
});

test('on a repository with auto-cancellation', function (assert) {
  this.repository.createSetting({ name: 'auto_cancel_pushes', value: true });
  this.repository.createSetting({ name: 'auto_cancel_pull_requests', value: false });

  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.ok(settingsPage.autoCancellationSection.exists, 'expected auto-cancellation section to exist');
    assert.ok(settingsPage.autoCancelPushes.isActive, 'expected auto-cancel pushes to be present and enabled');
    assert.notOk(settingsPage.autoCancelPullRequests.isActive, 'expected auto-cancel pull requests to be present but disabled');
  });

  const settingToRequestBody = {};

  server.patch(`/repo/${this.repository.id}/setting/:setting`, function (schema, request) {
    settingToRequestBody[request.params.setting] = JSON.parse(request.requestBody);
  });

  settingsPage.autoCancelPullRequests.toggle();

  andThen(() => {
    assert.ok(settingsPage.autoCancelPullRequests.isActive, 'expected auto-cancel pull requests to be enabled');
    assert.deepEqual(settingToRequestBody.auto_cancel_pull_requests, { 'setting.value': true });
  });

  settingsPage.autoCancelPushes.toggle();

  andThen(() => {
    assert.notOk(settingsPage.autoCancelPushes.isActive, 'expected auto-cancel pushes to be disabled');
    assert.deepEqual(settingToRequestBody.auto_cancel_pushes, { 'setting.value': false });
  });

  percySnapshot(assert);
});
