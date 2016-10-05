import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import settingsPage from 'travis/tests/pages/settings';

moduleForAcceptance('Acceptance | repo settings', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organizatin
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life',
      slug: 'killjoys/living-a-feminist-life',

      // FIXME figure out how to define this more cleanly
      '@permissions': {
        'create_cron': true
      }
    });

    repository.createSetting({ name: 'builds_only_with_travis_yml', value: true });
    repository.createSetting({ name: 'build_pushes', value: true });
    repository.createSetting({ name: 'maximum_number_of_builds', value: 1919 });
    repository.createSetting({ name: 'build_pull_requests', value: true });

    repository.createEnvVar({
      id: 'a',
      name: 'intersectionality',
      public: true,
      value: 'Kimberlé Crenshaw'
    });

    repository.createEnvVar({
      id: 'b',
      name: 'published',
      public: null,
      value: null
    });

    repository.createCustomSshKey({
      description: 'testy',
      fingerprint: 'dd:cc:bb:aa',
      type: 'custom'
    });

    repository.createDefaultSshKey({
      type: 'default',
      fingerprint: 'aa:bb:cc:dd',
      key: 'A PUBLIC KEY!'
    });

    this.repository = repository;

    const repoId = parseInt(repository.id);

    const dailyBranch = server.create('branch', {
      name: 'daily-branch',
      id: `/v3/repos/${repoId}/branches/daily-branch`
    });

    const weeklyBranch = server.create('branch', {
      name: 'weekly-branch',
      id: `/v3/repos/${repoId}/branches/weekly-branch`
    });

    this.dailyCron = server.create('cron', {
      interval: 'daily',
      disable_by_build: false,
      next_enqueuing: '2016-05-20T13:19:19Z',
      repository_id: repoId,
      branchId: dailyBranch.id
    });

    server.create('cron', {
      interval: 'weekly',
      disable_by_build: true,
      next_enqueuing: '2016-05-20T14:20:10Z',
      repository_id: repoId,
      branchId: weeklyBranch.id
    });
  }
});

test('view settings', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(function () {
    assert.ok(settingsPage.buildOnlyWithTravisYml.isActive, 'expected builds only with .travis.yml');
    assert.ok(settingsPage.buildPushes.isActive, 'expected builds for pushes');

    assert.ok(settingsPage.limitConcurrentBuilds.isActive, 'expected concurrent builds to be limited');
    assert.equal(settingsPage.limitConcurrentBuilds.value, '1919');

    assert.ok(settingsPage.buildPullRequests.isActive, 'expected builds for pull requests');

    assert.equal(settingsPage.environmentVariables(0).name, 'intersectionality');
    assert.ok(settingsPage.environmentVariables(0).isPublic, 'expected environment variable to be public');
    assert.equal(settingsPage.environmentVariables(0).value, 'Kimberlé Crenshaw');

    assert.equal(settingsPage.environmentVariables(1).name, 'published');
    assert.notOk(settingsPage.environmentVariables(1).isPublic, 'expected environment variable to not be public');
    assert.equal(settingsPage.environmentVariables(1).value, '••••••••••••••••');

    assert.equal(settingsPage.crons(0).branchName, 'daily-branch');
    assert.ok(settingsPage.crons(0).enqueuingInterval.indexOf('Enqueues each day after') === 0, 'Shows daily enqueuing text');
    assert.ok(settingsPage.crons(0).disableByBuildText.indexOf('Always run') === 0, 'expected cron to run even if no new commit after last build');

    assert.equal(settingsPage.crons(1).branchName, 'weekly-branch');
    assert.ok(settingsPage.crons(1).enqueuingInterval.indexOf('Enqueues each') === 0, 'Shows weekly enqueuing text');
    assert.ok(settingsPage.crons(1).disableByBuildText.indexOf('Only if no new commit') === 0, 'expected cron to run only if no new commit after last build');

    assert.equal(settingsPage.sshKey.name, 'testy');
    assert.equal(settingsPage.sshKey.fingerprint, 'dd:cc:bb:aa');
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
    assert.deepEqual(settingToRequestBody.build_pushes, { 'user_setting.value': false });
  });

  settingsPage.buildOnlyWithTravisYml.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildOnlyWithTravisYml.isActive, 'expected builds without .travis.yml');
    assert.deepEqual(settingToRequestBody.builds_only_with_travis_yml, { 'user_setting.value': false });
  });

  settingsPage.buildPullRequests.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildPullRequests.isActive, 'expected no builds for pull requests');
    assert.deepEqual(settingToRequestBody.build_pull_requests, { 'user_setting.value': false });
  });

  settingsPage.limitConcurrentBuilds.fill('2010');

  andThen(() => {
    assert.equal(settingsPage.limitConcurrentBuilds.value, '2010');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'user_setting.value': 2010 });
  });

  settingsPage.limitConcurrentBuilds.toggle();

  andThen(() => {
    assert.notOk(settingsPage.limitConcurrentBuilds.isActive, 'expected unlimited concurrent builds');
    assert.deepEqual(settingToRequestBody.maximum_number_of_builds, { 'user_setting.value': 0 });
  });
});

test('delete and create environment variables', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/env_vars/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  settingsPage.environmentVariables(0).delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), 'a', 'expected the server to have received a deletion request for the first environment variable');
    assert.equal(settingsPage.environmentVariables().count, 1, 'expected only one environment variable to remain');
    assert.equal(settingsPage.environmentVariables(0).name, 'published', 'expected the formerly-second variable to be first');
  });

  const requestBodies = [];

  server.post('/settings/env_vars', function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    parsedRequestBody.env_var.id = '1919';
    requestBodies.push(parsedRequestBody);
    return parsedRequestBody;
  });

  settingsPage.environmentVariableForm.fillName('drafted');
  settingsPage.environmentVariableForm.fillValue('true');
  settingsPage.environmentVariableForm.makePublic();
  settingsPage.environmentVariableForm.add();

  andThen(() => {
    assert.equal(settingsPage.environmentVariables(1).name, 'drafted');
    assert.ok(settingsPage.environmentVariables(1).isPublic, 'expected environment variable to be public');
    assert.equal(settingsPage.environmentVariables(1).value, 'true');

    assert.deepEqual(requestBodies.pop(), { env_var: {
      id: '1919',
      name: 'drafted',
      value: 'true',
      public: true,
      repository_id: this.repository.id
    } });

    // This will trigger a client-side error
    server.post('/settings/env_vars', undefined, 403);
  });

  settingsPage.environmentVariableForm.fillName('willFail');
  settingsPage.environmentVariableForm.fillValue('true');
  settingsPage.environmentVariableForm.add();

  andThen(() => {
    assert.equal(settingsPage.notification, 'There was an error saving this environment variable.');
  });
});

test('delete and create crons', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/cron/:id', function (schema, request) {
    deletedIds.push(request.params.id);
    schema.db.crons.remove(request.params.id);
    return {};
  });

  settingsPage.crons(0).delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.dailyCron.id, 'expected the server to have received a deletion request for the first cron');
    assert.equal(settingsPage.crons().count, 1, 'expected only one cron to remain');
  });
});

test('delete and set SSH keys', function (assert) {
  settingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/ssh_key/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  settingsPage.sshKey.delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.repository.id, 'expected the server to have received a deletion request for the SSH key');

    assert.equal(settingsPage.sshKey.name, 'no custom key set');
    assert.equal(settingsPage.sshKey.fingerprint, 'aa:bb:cc:dd');
    assert.ok(settingsPage.sshKey.cannotBeDeleted, 'expected default SSH key not to be deletable');
  });

  const requestBodies = [];

  server.patch(`/settings/ssh_key/${this.repository.id}`, (schema, request) => {
    const newKey = JSON.parse(request.requestBody);
    requestBodies.push(newKey);
    newKey.id = this.repository.id;

    return {
      ssh_key: newKey
    };
  });

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
