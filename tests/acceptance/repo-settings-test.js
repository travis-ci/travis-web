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

    const organization = server.create('account', {
      name: 'Goldsmiths',
      type: 'organization',
      login: 'goldsmiths',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life',

      // FIXME this is maybe not the best way to create dependent models
      settings: {
        builds_only_with_travis_yml: true,
        build_pushes: true,
        maximum_number_of_builds: 1919,
        build_pull_requests: true
      },

      env_vars: [
        {id: 'a', name: 'intersectionality', public: true, value: 'Kimberlé Crenshaw'},
        {id: 'b', name: 'published', public: null, value: null}
      ],

      "@permissions": {
        "create_cron": true
      }
    });

    const repoId = parseInt(repository.id);

    const dailyBranch = server.create('branch', {
      name: 'daily-branch',
      id: `/v3/repos/${repoId}/branches/daily-branch`
    });

    const weeklyBranch = server.create('branch', {
      name: 'weekly-branch',
      id: `/v3/repos/${repoId}/branches/weekly-branch`
    });

    server.create('cron', {
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


    server.create('permissions', {
      admin: [repoId],
      push: [repoId],
      pull: [repoId],
      permissions: [repoId],
    });

  }
});

test('view settings', function(assert) {
  settingsPage.visit({organization: 'goldsmiths', repo: 'living-a-feminist-life'});

  andThen(function() {
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
    assert.equal(settingsPage.crons(0).interval, 'daily');
    assert.ok(settingsPage.crons(0).nextEnqueuing.indexOf(':19'), 'expected cron next enqueuing to match');
    assert.ok(settingsPage.crons(0).disableByBuildText.indexOf('Even') === 0, 'expected cron to run even if no new commit after last build');

    assert.equal(settingsPage.crons(1).branchName, 'weekly-branch');
    assert.equal(settingsPage.crons(1).interval, 'weekly');
    assert.ok(settingsPage.crons(1).nextEnqueuing.indexOf(':11'), 'expected cron next enqueuing to match');
    assert.ok(settingsPage.crons(1).disableByBuildText.indexOf('Only') === 0, 'expected cron to run only if no new commit after last build');
  });
});

test('change general settings', function(assert) {
  settingsPage.visit({organization: 'goldsmiths', repo: 'living-a-feminist-life'});

  const requestBodies = [];

  // FIXME this should not have the repository ID hardcoded
  server.patch('/repos/1/settings', function(schema, request) {
    requestBodies.push(JSON.parse(request.requestBody));
  });

  settingsPage.buildPushes.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildPushes.isActive, 'expected no builds for pushes');
    assert.deepEqual(requestBodies.pop(), {settings: {build_pushes: false}});
  });

  settingsPage.buildOnlyWithTravisYml.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildOnlyWithTravisYml.isActive, 'expected builds without .travis.yml');
    assert.deepEqual(requestBodies.pop(), {settings: {builds_only_with_travis_yml: false}});
  });

  settingsPage.buildPullRequests.toggle();

  andThen(() => {
    assert.notOk(settingsPage.buildPullRequests.isActive, 'expected no builds for pull requests');
    assert.deepEqual(requestBodies.pop(), {settings: {build_pull_requests: false}});
  });

  // FIXME unable to trigger a change of this value
  // settingsPage.limitConcurrentBuilds.fill('2010');
  //
  // andThen(() => {
  //   assert.equal(settingsPage.limitConcurrentBuilds.value, '2010');
  //   assert.deepEqual(requestBodies.pop(), {settings: {maximum_number_of_builds: 2010}});
  // });

  settingsPage.limitConcurrentBuilds.toggle();

  andThen(() => {
    assert.notOk(settingsPage.limitConcurrentBuilds.isActive, 'expected unlimited concurrent builds');
    assert.deepEqual(requestBodies.pop(), {settings: {maximum_number_of_builds: 0}});
  });
});
