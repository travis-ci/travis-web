/* global signInUser */
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build-list';

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

    this.branch = server.create('branch', { name: 'foobar' });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 5);

    const cronBranch = server.create('branch', { name: 'successful-cron-branch' });

    const lastBuild = server.create('build', {
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
      repository,
      branch: cronBranch,
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name,
      author_email: currentUser.email,
      committer_name: currentUser.name,
      committer_email: currentUser.email,
    };
    this.commitAttributes = commitAttributes;

    lastBuild.createCommit(commitAttributes);
    lastBuild.save();

    const failedBuild = server.create('build', {
      state: 'failed',
      event_type: 'push',
      repositoryId: this.repoId,
      number: '1885',
      branch: this.branch,
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredBuild = server.create('build', {
      state: 'errored',
      event_type: 'push',
      repositoryId: this.repoId,
      number: '1869',
      branch: this.branch,
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();
  }
});

test('build history shows, more can be loaded, and a created build gets added and can be cancelled', function (assert) {
  page.visitBuildHistory({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(page.builds().count, 3, 'expected three non-PR builds');

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
  });

  percySnapshot(assert);

  server.get('/repo/:repo_id/builds', function (schema, request) {
    const { offset } = request.queryParams;
    if (offset) {
      // Add another build so the API has more to return
      const oldestBranch = server.create('branch', { name: 'oldest-build-branch' });
      const oldestBuild = server.create('build', {
        event_type: 'push',
        repositoryId: '1',
        number: '1816',
        branch: oldestBranch,
      });

      oldestBuild.createCommit({
        sha: 'acab',
        author_name: 'us',
        branch: 'oldest-build-branch'
      });

      oldestBuild.save();

      const build = schema.builds.where({ repositoryId: request.params.repo_id }).models.slice(-1);
      const builds = {
        models: build
      };

      return this.serialize(builds, 'build');
    } else {
      let builds = schema.builds.where({ repositoryId: request.params.repo_id });

      builds = builds.filter(build => build.attrs.number);

      if (request.queryParams.event_type !== 'pull_request') {
        builds = builds.filter(build => build.attrs.event_type !== 'pull_request');
      }

      if (request.queryParams.sort_by === 'finished_at:desc') {
        builds = builds.sort((a, b) => {
          const aBuildNumber = a.attrs.number;
          const bBuildNumber = b.attrs.number;

          return aBuildNumber > bBuildNumber ? -1 : 1;
        });
      }

      return this.serialize(builds);
    }
  });

  page.showMoreButton.click();

  andThen(() => {});

  andThen(() => {
    assert.equal(page.builds().count, 4, 'expected four builds');
    assert.equal(page.builds(3).name, 'oldest-build-branch', 'expected an earlier build to have been added');
  });

  const buildEventDataTemplate = {
    build: {
      id: '2016',
      repository_id: this.repoId,
      number: '2016',
      pull_request: false,
      event_type: 'push',
      branch: 'no-dapl',
      message: 'Standing with Standing Rock',
      commit_id: 2016,
    },
    commit: {
      id: 2016,
      branch: 'no-dapl',
      sha: 'acab',
      message: 'Standing with Standing Rock',
      committed_at: '2017-03-01T13:22:18Z',
    },
  };

  andThen(() => {
    const createdData = Object.assign({}, buildEventDataTemplate);
    createdData.build.state = 'created';
    this.application.pusher.receive('build:created', createdData);
  });


  andThen(() => {
    assert.equal(page.builds().count, 5, 'expected another build');

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
