import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import repositorySettingsPage from 'travis/tests/pages/repository-settings';

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

    repository.createSetting({
      builds_only_with_travis_yml: true,
      build_pushes: true,
      maximum_number_of_builds: 1919,
      build_pull_requests: true
    });

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
  repositorySettingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(function () {
    assert.ok(repositorySettingsPage.buildOnlyWithTravisYml.isActive, 'expected builds only with .travis.yml');
    assert.ok(repositorySettingsPage.buildPushes.isActive, 'expected builds for pushes');

    assert.ok(repositorySettingsPage.limitConcurrentBuilds.isActive, 'expected concurrent builds to be limited');
    assert.equal(repositorySettingsPage.limitConcurrentBuilds.value, '1919');

    assert.ok(repositorySettingsPage.buildPullRequests.isActive, 'expected builds for pull requests');

    assert.equal(repositorySettingsPage.environmentVariables(0).name, 'intersectionality');
    assert.ok(repositorySettingsPage.environmentVariables(0).isPublic, 'expected environment variable to be public');
    assert.equal(repositorySettingsPage.environmentVariables(0).value, 'Kimberlé Crenshaw');

    assert.equal(repositorySettingsPage.environmentVariables(1).name, 'published');
    assert.notOk(repositorySettingsPage.environmentVariables(1).isPublic, 'expected environment variable to not be public');
    assert.equal(repositorySettingsPage.environmentVariables(1).value, '••••••••••••••••');

    assert.equal(repositorySettingsPage.crons(0).branchName, 'daily-branch');
    assert.ok(repositorySettingsPage.crons(0).enqueuingInterval.indexOf('Enqueues each day after') === 0, 'Shows daily enqueuing text');
    assert.ok(repositorySettingsPage.crons(0).disableByBuildText.indexOf('Always run') === 0, 'expected cron to run even if no new commit after last build');

    assert.equal(repositorySettingsPage.crons(1).branchName, 'weekly-branch');
    assert.ok(repositorySettingsPage.crons(1).enqueuingInterval.indexOf('Enqueues each') === 0, 'Shows weekly enqueuing text');
    assert.ok(repositorySettingsPage.crons(1).disableByBuildText.indexOf('Only if no new commit') === 0, 'expected cron to run only if no new commit after last build');

    assert.equal(repositorySettingsPage.sshKey.name, 'testy');
    assert.equal(repositorySettingsPage.sshKey.fingerprint, 'dd:cc:bb:aa');
  });
});

test('change general settings', function (assert) {
  repositorySettingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const requestBodies = [];

  server.patch(`/repos/${this.repository.id}/settings`, function (schema, request) {
    requestBodies.push(JSON.parse(request.requestBody));
  });

  repositorySettingsPage.buildPushes.toggle();

  andThen(() => {
    assert.notOk(repositorySettingsPage.buildPushes.isActive, 'expected no builds for pushes');
    assert.deepEqual(requestBodies.pop(), { settings: { build_pushes: false } });
  });

  repositorySettingsPage.buildOnlyWithTravisYml.toggle();

  andThen(() => {
    assert.notOk(repositorySettingsPage.buildOnlyWithTravisYml.isActive, 'expected builds without .travis.yml');
    assert.deepEqual(requestBodies.pop(), { settings: { builds_only_with_travis_yml: false } });
  });

  repositorySettingsPage.buildPullRequests.toggle();

  andThen(() => {
    assert.notOk(repositorySettingsPage.buildPullRequests.isActive, 'expected no builds for pull requests');
    assert.deepEqual(requestBodies.pop(), { settings: { build_pull_requests: false } });
  });

  repositorySettingsPage.limitConcurrentBuilds.fill('2010');

  andThen(() => {
    assert.equal(repositorySettingsPage.limitConcurrentBuilds.value, '2010');
    assert.deepEqual(requestBodies.pop(), { settings: { maximum_number_of_builds: 2010 } });
  });

  repositorySettingsPage.limitConcurrentBuilds.toggle();

  andThen(() => {
    assert.notOk(repositorySettingsPage.limitConcurrentBuilds.isActive, 'expected unlimited concurrent builds');
    assert.deepEqual(requestBodies.pop(), { settings: { maximum_number_of_builds: 0 } });
  });
});

test('delete and create environment variables', function (assert) {
  repositorySettingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/env_vars/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  repositorySettingsPage.environmentVariables(0).delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), 'a', 'expected the server to have received a deletion request for the first environment variable');
    assert.equal(repositorySettingsPage.environmentVariables().count, 1, 'expected only one environment variable to remain');
    assert.equal(repositorySettingsPage.environmentVariables(0).name, 'published', 'expected the formerly-second variable to be first');
  });

  const requestBodies = [];

  server.post('/settings/env_vars', function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    requestBodies.push(parsedRequestBody);
    return parsedRequestBody;
  });

  repositorySettingsPage.environmentVariableForm.fillName('drafted');
  repositorySettingsPage.environmentVariableForm.fillValue('true');
  repositorySettingsPage.environmentVariableForm.makePublic();
  repositorySettingsPage.environmentVariableForm.add();

  andThen(() => {
    assert.equal(repositorySettingsPage.environmentVariables(1).name, 'drafted');
    assert.ok(repositorySettingsPage.environmentVariables(1).isPublic, 'expected environment variable to be public');
    assert.equal(repositorySettingsPage.environmentVariables(1).value, 'true');

    assert.deepEqual(requestBodies.pop(), { env_var: { name: 'drafted', value: 'true', public: true, repository_id: this.repository.id } });
  });
});

test('delete and create crons', function (assert) {
  repositorySettingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/cron/:id', function (schema, request) {
    deletedIds.push(request.params.id);
    schema.db.crons.remove(request.params.id);
    return {};
  });

  repositorySettingsPage.crons(0).delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.dailyCron.id, 'expected the server to have received a deletion request for the first cron');
    assert.equal(repositorySettingsPage.crons().count, 1, 'expected only one cron to remain');
  });
});

test('delete and set SSH keys', function (assert) {
  repositorySettingsPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  const deletedIds = [];

  server.delete('/settings/ssh_key/:id', function (schema, request) {
    deletedIds.push(request.params.id);
  });

  repositorySettingsPage.sshKey.delete();

  andThen(() => {
    assert.equal(deletedIds.pop(), this.repository.id, 'expected the server to have received a deletion request for the SSH key');

    assert.equal(repositorySettingsPage.sshKey.name, 'no custom key set');
    assert.equal(repositorySettingsPage.sshKey.fingerprint, 'aa:bb:cc:dd');
    assert.ok(repositorySettingsPage.sshKey.cannotBeDeleted, 'expected default SSH key not to be deletable');
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

  repositorySettingsPage.sshKeyForm.fillDescription('hey');
  repositorySettingsPage.sshKeyForm.fillKey('hello');
  repositorySettingsPage.sshKeyForm.add();

  andThen(() => {
    assert.deepEqual(requestBodies.pop().ssh_key, {
      id: this.repository.id,
      description: 'hey',
      value: 'hello'
    });
  });
});
