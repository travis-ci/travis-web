/* global signInUser */
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build-list';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';

import Ember from 'ember';

moduleForAcceptance('Acceptance | repo build list routes', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    const gitUser = server.create('git-user', {
      name: 'Sara Ahmed'
    });

    const repository = server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });
    this.repository = repository;

    this.repoId = parseInt(repository.id);

    this.branch = server.create('branch', { name: 'successful-cron-branch' });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 5);

    const lastBuild = this.branch.createBuild({
      state: 'passed',
      number: '1918',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
      repository,
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name,
      author: gitUser,
      committer: gitUser
    };

    lastBuild.createCommit(Ember.assign({
      branch: 'successful-cron-branch',
      message: 'A generic cron commit message'
    }, commitAttributes));
    lastBuild.save();

    const failedBuild = this.branch.createBuild({
      state: 'failed',
      event_type: 'push',
      repository,
      number: '1885'
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredBuild = this.branch.createBuild({
      state: 'errored',
      event_type: 'push',
      repository,
      number: '1869'
    });

    erroredBuild.branch = this.branch;
    erroredBuild.createCommit(Object.assign({ branch: 'rarely-used' }, commitAttributes));
    erroredBuild.save();

    const defaultBranch = repository.createBranch({
      name: 'rarely-used',
      default_branch: true
    });

    const defaultBranchBuild = defaultBranch.createBuild({
      number: '1491',
      event_type: 'push',
      repository,
    });

    defaultBranchBuild.createCommit(Object.assign({}, commitAttributes, {
      branch: 'rarely-used'
    }));
    defaultBranchBuild.save();

    const pullRequestCommit = server.create('commit', commitAttributes);
    const pullRequestBuild = this.branch.createBuild({
      state: 'started',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'pull_request',
      pull_request_number: 2010,
      repository,
      pull_request_title: 'A pull request',
      commit: pullRequestCommit
    });
    // TODO: inverse relationship settings should take care of this (probably?)
    pullRequestCommit.build = pullRequestBuild;
    pullRequestCommit.save();

    pullRequestBuild.createJob({
      number: '1919.1',
      repository,
      state: 'started',
      build: pullRequestBuild,
      commit: pullRequestCommit
    });

    pullRequestBuild.save();
  }
});

test('build history shows, more can be loaded, and a created build gets added and can be cancelled', function (assert) {
  assert.expect(23);

  page.visitBuildHistory({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 3, 'expected three builds');

    const build = page.builds(0);

    assert.ok(build.passed, 'expected the first build to have passed');
    assert.equal(build.name, 'successful-cron-branch');
    assert.equal(build.committer, 'Sara Ahmed');
    assert.equal(build.commitSha, '1234567');
    assert.equal(build.commitDate, 'about a year ago');
    assert.equal(build.requestIconTitle, 'Triggered by a cron job');
    assert.equal(build.duration, '5 min');
    assert.equal(build.message, 'cron A generic cron commit message', 'expected a prefixed cron marker');

    assert.ok(page.builds(1).failed, 'expected the second build to have failed');
    assert.ok(page.builds(2).errored, 'expected the third build to have errored');

    assert.ok(page.showMoreButton.exists, 'expected the Show More button to exist');

    assert.equal(page.builds(2).name, 'rarely-used', 'expected the old default branch to show');

    // Add another build so the API has more to return
    const olderBuild = this.branch.createBuild({
      event_type: 'push',
      repository: this.repository,
      number: '1816'
    });

    olderBuild.createCommit({
      sha: 'acab',
      author_name: 'us',
      branch: 'seven-oaks'
    });
    olderBuild.save();
  });

  percySnapshot(assert);

  page.showMoreButton.click();

  andThen(() => {
    assert.equal(page.builds().count, 5, 'expected five builds');
    assert.equal(page.builds(3).name, 'seven-oaks', 'expected the build before the last one to have been added');
    assert.equal(page.builds(4).name, 'rarely-used', 'expected the old default branch build to have moved to the end');
  });

  const branch = server.create('branch', {
    name: 'no-dapl'
  });

  this.repository.defaultBranch = branch;
  this.repository.save();

  const build = server.create('build', {
    id: '2016',
    repository: this.repository,
    number: '2016',
    pull_request: false,
    event_type: 'push',
    branch: branch
  });

  const commit = build.createCommit({
    id: 2016,
    branch: 'no-dapl',
    sha: 'acab',
    message: 'Standing with Standing Rock'
  });

  andThen(() => {
    const createdData = {
      build: generatePusherPayload(build),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository)
    };
    createdData.build.state = 'created';
    this.application.pusher.receive('build:created', createdData);
  });

  andThen(() => {
    assert.equal(page.builds().count, 6, 'expected another build');

    const newBuild = page.builds(0);

    assert.ok(newBuild.created, 'expected the new build to show as created');
    assert.equal(newBuild.name, 'no-dapl');
    assert.equal(newBuild.message, 'Standing with Standing Rock');
    assert.equal(newBuild.requestIconTitle, 'Triggered by a push');

    const startedData = {
      build: generatePusherPayload(build, { state: 'started' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository)
    };
    this.application.pusher.receive('build:started', startedData);
  });

  andThen(() => {
    assert.ok(page.builds(0).started, 'expected the new build to show as started');

    const finishedData = {
      build: generatePusherPayload(build, { state: 'passed' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository)
    };
    this.application.pusher.receive('build:finished', finishedData);
  });

  andThen(() => {
    assert.ok(page.builds(0).passed, 'expected the newly-finished build to have passed');
  });
});

test('view and cancel pull requests', function (assert) {
  assert.expect(10);
  page.visitPullRequests({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 1, 'expected one pull request build');

    const pullRequest = page.builds(0);

    assert.ok(pullRequest.started, 'expected the pull request to have started');
    assert.equal(pullRequest.name, 'PR #2010');
    assert.equal(pullRequest.message, 'A pull request');
    assert.equal(pullRequest.committer, 'Sara Ahmed');
    assert.equal(pullRequest.commitSha, '1234567');
    assert.equal(pullRequest.commitDate, 'about a year ago');
    assert.equal(pullRequest.duration, '5 min');

    assert.ok(pullRequest.cancelButton.visible, 'expected the cancel button to be visible');
  });
  percySnapshot(assert);

  page.builds(0).cancelButton.click();

  andThen(() => {
    assert.equal(page.notification, 'Build has been successfully cancelled.');
  });
});
