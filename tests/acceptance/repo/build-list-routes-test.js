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

    const branch = server.create('branch');

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 5);

    const lastBuild = branch.createBuild({
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

    const failedBuild = branch.createBuild({
      state: 'failed',
      event_type: 'push',
      repository_id: this.repoId
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredBuild = branch.createBuild({
      state: 'errored',
      event_type: 'push',
      repository_id: this.repoId
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();

    const pullRequestBuild = branch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'pull_request',
      pull_request_number: 2010,
      repository_id: this.repoId,
      pull_request_title: 'A pull request'
    });

    pullRequestBuild.createCommit(commitAttributes);
    pullRequestBuild.save();
  }
});

test('view build history and display a created build', function (assert) {
  page.visitBuildHistory({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 3, 'expected three builds');

    const build = page.builds(0);

    assert.ok(build.passed, 'expected the first build to have passed');
    assert.equal(build.name, 'successful-cron-branch');
    assert.equal(build.committer, 'Sara Ahmed');
    assert.equal(build.commitSha, '1234567');
    assert.equal(build.commitDate, 'about a year ago');
    assert.equal(build.duration, '5 min');

    assert.ok(page.builds(1).failed, 'expected the second build to have failed');
    assert.ok(page.builds(2).errored, 'expected the third build to have errored');
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
    assert.equal(page.builds().count, 4, 'expected another build');

    const newBuild = page.builds(0);

    assert.ok(newBuild.created, 'expected the new build to show as created');
    assert.equal(newBuild.name, 'no-dapl');
    assert.equal(newBuild.message, 'Standing with Standing Rock');

    const startedData = Object.assign({}, buildEventDataTemplate);
    startedData.build.state = 'started';
    this.application.pusher.receive('build:started', startedData);
  });

  percySnapshot(assert);

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

test('view pull requests', function (assert) {
  page.visitPullRequests({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 1, 'expected one pull request build');

    const pullRequest = page.builds(0);

    assert.ok(pullRequest.passed, 'expected the pull request to have passed');
    assert.equal(pullRequest.name, 'PR #2010');
    assert.equal(pullRequest.message, 'A pull request');
    assert.equal(pullRequest.committer, 'Sara Ahmed');
    assert.equal(pullRequest.commitSha, '1234567');
    assert.equal(pullRequest.commitDate, 'about a year ago');
    assert.equal(pullRequest.duration, '5 min');
  });
  percySnapshot(assert);
});
