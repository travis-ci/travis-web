/* global signInUser */
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build-list';

import Ember from 'ember';

moduleForAcceptance('Acceptance | repo build list routes', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    const repository = server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });

    this.repoId = parseInt(repository.id);

    this.branch = server.create('branch');

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 5);

    const lastBuild = this.branch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
      repository_id: this.repoId
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name
    };

    lastBuild.createCommit(Ember.assign({
      branch: 'successful-cron-branch'
    }, commitAttributes));
    lastBuild.save();

    const failedBuild = this.branch.createBuild({
      state: 'failed',
      event_type: 'push',
      repository_id: this.repoId,
      number: '1885'
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredBuild = this.branch.createBuild({
      state: 'errored',
      event_type: 'push',
      repository_id: this.repoId,
      number: '1869'
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();

    const defaultBranch = repository.createBranch({
      name: 'rarely-used',
      default_branch: true
    });

    const defaultBranchBuild = defaultBranch.createBuild({
      number: '1491',
      event_type: 'push',
      repository_id: this.repoId
    });

    defaultBranchBuild.createCommit(Object.assign({}, commitAttributes, {
      branch: 'rarely-used'
    }));
    defaultBranchBuild.save();

    const pullRequestBuild = this.branch.createBuild({
      state: 'started',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'pull_request',
      pull_request_number: 2010,
      repository_id: this.repoId,
      pull_request_title: 'A pull request'
    });

    const pullRequestCommit = pullRequestBuild.createCommit(commitAttributes);
    pullRequestBuild.save();

    pullRequestBuild.createJob({
      number: '1919.1',
      repository_id: this.repoId,
      state: 'started',
      build: pullRequestBuild,
      commit_id: pullRequestCommit.id
    });

    pullRequestBuild.save();
  }
});

test('build history shows, more can be loaded, and a created build gets added and can be cancelled', function (assert) {
  page.visitBuildHistory({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 4, 'expected four builds');

    const build = page.builds(0);

    assert.ok(build.passed, 'expected the first build to have passed');
    assert.equal(build.name, 'successful-cron-branch');
    assert.equal(build.committer, 'Sara Ahmed');
    assert.equal(build.commitSha, '1234567');
    assert.equal(build.commitDate, 'about a year ago');
    assert.equal(build.duration, '5 min');

    assert.ok(page.builds(1).failed, 'expected the second build to have failed');
    assert.ok(page.builds(2).errored, 'expected the third build to have errored');

    assert.ok(page.showMoreButton.exists, 'expected the Show More button to exist');

    assert.equal(page.builds(3).name, 'rarely-used', 'expected the old default branch to show');

    // Add another build so the API has more to return
    const olderBuild = this.branch.createBuild({
      event_type: 'push',
      repository_id: this.repoId,
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

  const buildEventDataTemplate = {
    build: {
      id: '2016',
      repository_id: this.repoId,
      number: '2016',
      pull_request: false,
      event_type: 'push',
      branch: 'no-dapl',
      commit_id: 2016,
    },
    commit: {
      id: 2016,
      branch: 'no-dapl',
      sha: 'acab',
      message: 'Standing with Standing Rock'
    }
  };

  andThen(() => {
    const createdData = Object.assign({}, buildEventDataTemplate);
    createdData.build.state = 'created';
    this.application.pusher.receive('build:created', createdData);
  });

  andThen(() => {
    assert.equal(page.builds().count, 6, 'expected another build');

    const newBuild = page.builds(0);

    assert.ok(newBuild.created, 'expected the new build to show as created');
    assert.equal(newBuild.name, 'no-dapl');
    assert.equal(newBuild.message, 'Standing with Standing Rock');

    const startedData = Object.assign({}, buildEventDataTemplate);
    startedData.build.state = 'started';
    this.application.pusher.receive('build:started', startedData);
  });

  andThen(() => {
    assert.ok(page.builds(0).started, 'expected the new build to show as started');

    const finishedData = Object.assign({}, buildEventDataTemplate);
    finishedData.build.state = 'passed';
    this.application.pusher.receive('build:finished', finishedData);
  });

  andThen(() => {
    assert.ok(page.builds(0).passed, 'expected the newly-finished build to have passed');
  });
});

test('view and cancel pull requests', function (assert) {
  server.logging = true;
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
