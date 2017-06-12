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

    const cronBranch = server.create('branch', { repository, name: 'successful-cron-branch' });

    const lastBuild = server.create('build', {
      state: 'passed',
      number: '1918',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
      repository,
      branch: cronBranch,
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name,
      author: gitUser,
      committer: gitUser
    };
    this.commitAttributes = commitAttributes;

    lastBuild.createCommit(Ember.assign({
      message: 'A generic cron commit message'
    }, commitAttributes));
    lastBuild.save();

    const failedBuild = server.create('build', {
      state: 'failed',
      event_type: 'push',
      repository,
      number: '1885'
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const defaultBranch = repository.createBranch({
      name: 'rarely-used',
      default_branch: true
    });

    const erroredBuild = server.create('build', {
      state: 'errored',
      event_type: 'push',
      repository,
      number: '1869',
      branch: defaultBranch
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();

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
  assert.expect(22);

  page.visitBuildHistory({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 4, 'expected four non-PR builds');

    page.builds(0).as(build => {
      assert.ok(build.passed, 'expected the first build to have passed');
      assert.equal(build.name, 'successful-cron-branch');
      assert.equal(build.committer, 'Sara Ahmed');
      assert.equal(build.commitSha, '1234567');
      assert.equal(build.commitDate, 'about a year ago');
      assert.equal(build.requestIconTitle, 'Triggered by a cron job');
      assert.equal(build.duration, '5 min');
      assert.equal(build.message, 'cron A generic cron commit message', 'expected a prefixed cron marker');
    });

    assert.ok(page.builds(1).failed, 'expected the second build to have failed');
    assert.ok(page.builds(2).errored, 'expected the third build to have errored');

    assert.ok(page.showMoreButton.exists, 'expected the Show More button to exist');

    assert.equal(page.builds(2).name, 'rarely-used', 'expected the old default branch to show');

    const sevenOaksBranch = server.create('branch', {
      name: 'oldest-build-branch'
    });

    // Add another build so the API has more to return
    const olderBuild = sevenOaksBranch.createBuild({
      event_type: 'push',
      repository: this.repository,
      number: '1000',
      state: 'passed'
    });

    olderBuild.createCommit({
      sha: 'acab',
      author_name: 'us'
    });
    olderBuild.save();
  });

  percySnapshot(assert);

  page.showMoreButton.click();

  andThen(() => {});
  andThen(() => {
    assert.equal(page.builds().count, 5, 'expected five builds');
    assert.equal(page.builds(4).name, 'oldest-build-branch', 'expected an earlier build to have been added');
  });

  let build, commit;

  andThen(() => {
    const branch = server.create('branch', {
      name: 'no-dapl'
    });

    this.repository.defaultBranch = branch;
    this.repository.save();

    build = branch.createBuild({
      id: '1920',
      repository: this.repository,
      number: '1920',
      pull_request: false,
      event_type: 'push',
    });

    commit = build.createCommit({
      id: 1920,
      sha: 'acab',
      message: 'Standing with Standing Rock',
      branch: 'no-dapl'
    });

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

    page.builds(0).as(newBuild => {
      assert.ok(newBuild.created, 'expected the new build to show as created');
      assert.equal(newBuild.name, 'no-dapl');
      assert.equal(newBuild.message, 'Standing with Standing Rock');
      assert.equal(newBuild.requestIconTitle, 'Triggered by a push');
    });

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

    page.builds(0).as(pullRequest => {
      assert.ok(pullRequest.started, 'expected the pull request to have started');
      assert.equal(pullRequest.name, 'PR #2010');
      assert.equal(pullRequest.message, 'A pull request');
      assert.equal(pullRequest.committer, 'Sara Ahmed');
      assert.equal(pullRequest.commitSha, '1234567');
      assert.equal(pullRequest.commitDate, 'about a year ago');
      assert.equal(pullRequest.duration, '5 min');

      assert.ok(pullRequest.cancelButton.visible, 'expected the cancel button to be visible');
    });
  });
  percySnapshot(assert);

  page.builds(0).cancelButton.click();

  andThen(() => {
    assert.equal(page.notification, 'Build has been successfully cancelled.');
  });
});

test('renders no builds messaging when none present', function (assert) {
  server.create('repository');

  page.visitBuildHistory({ organization: 'travis-ci', repo: 'travis-web' });

  andThen(() => {
    assert.equal(page.showsNoBuildsMessaging, 'No builds for this repository', 'Build History tab shows no builds message');
  });
});
