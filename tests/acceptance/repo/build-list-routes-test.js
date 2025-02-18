// import { assign } from '@ember/polyfills';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import {
  getContext,
  settled,
} from '@ember/test-helpers';
import page from 'travis/tests/pages/build-list';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';
import signInUser from 'travis/tests/helpers/sign-in-user';
import moment from 'moment';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo build list routes', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    const gitUser = this.server.create('git-user', {
      name: 'Other User Name'
    });

    const org = this.server.create('organization', { login: 'org-login' });
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('allowance', {subscription_type: 1});

    const repository = this.server.create('repository', {
      slug: 'org-login/repository-name',
      owner: {
        login: org.login,
        id: org.id
      }
    });
    this.repository = repository;

    this.repoId = parseInt(repository.id);

    this.branch = this.server.create('branch', { name: 'successful-cron-branch' });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);
    this.oneYearAgo = oneYearAgo;

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 5);

    const cronBranch = this.server.create('branch', { repository, name: 'successful-cron-branch' });

    const lastBuild = this.server.create('build', {
      state: 'passed',
      number: '1918',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
      repository,
      branch: cronBranch,
      createdBy: currentUser,
    });

    const commitAttributes = {
      sha: '1234567890',
      author: gitUser,
      committer: gitUser
    };
    this.commitAttributes = commitAttributes;

    lastBuild.createCommit(Object.assign({
      message: 'A generic cron commit message'
    }, commitAttributes));
    lastBuild.save();

    const failedBuild = this.server.create('build', {
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

    const erroredBuild = this.server.create('build', {
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
      state: 'canceled',
      event_type: 'push',
      repository,
    });

    defaultBranchBuild.createCommit(Object.assign({}, commitAttributes, {
      branch: 'rarely-used'
    }));
    defaultBranchBuild.save();

    const pullRequestCommit = this.server.create('commit', commitAttributes);
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
  });

  test('build history shows, all builds loaded, no button for more builds', async function (assert) {
    this.repository.build_count = 4;
    this.repository.save();
    await page.visitBuildHistory({ organization: 'org-login', repo: 'repository-name' });
    assert.equal(page.builds.length, 4, 'expected four non-PR builds');
    assert.equal(page.showMoreButton.text, 'Show export files');
  });

  test('build history shows, more can be loaded, and a created build gets added and can be cancelled', async function (assert) {
    assert.expect(24);

    await page.visitBuildHistory({ organization: 'org-login', repo: 'repository-name' });

    assert.equal(page.builds.length, 4, 'expected four non-PR builds');

    const { owner } = getContext();
    const app = owner.application;

    page.builds[0].as(build => {
      assert.ok(build.passed, 'expected the first build to have passed');
      assert.equal(build.name, 'successful-cron-branch');
      assert.equal(build.committer, 'Other User Name', 'expected to ignore createdBy for a cron');
      assert.equal(build.commitSha, '1234567');

      assert.equal(build.commitDate.text, 'about a year ago');
      assert.equal(build.commitDate.title, `Finished ${moment(this.oneYearAgo).format('lll')}`);

      assert.equal(build.requestIconTitle, 'Triggered by a cron job');
      assert.equal(build.duration, '5 min');
      assert.equal(build.message, 'cron A generic cron commit message', 'expected a prefixed cron marker');
    });

    assert.ok(page.builds[1].failed, 'expected the second build to have failed');
    assert.equal(page.builds[1].committer, 'Other User Name', 'expected a fallback to committer when no createdBy');

    assert.ok(page.builds[2].errored, 'expected the third build to have errored');

    assert.ok(page.showMoreButton.exists, 'expected the Show More button to exist');

    assert.equal(page.builds[2].name, 'rarely-used', 'expected the old default branch to show');

    const sevenOaksBranch = this.server.create('branch', {
      name: 'oldest-build-branch'
    });

    // Add another build so the API has more to return
    const olderBuild = sevenOaksBranch.createBuild({
      event_type: 'push',
      repository: this.repository,
      number: '1000',
      state: 'passed'
    });

    let us = this.server.create('git-user', { name: 'us' });

    olderBuild.createCommit({
      sha: 'acab',
      author: us
    });
    olderBuild.save();


    await page.showMoreButton.click();

    assert.equal(page.builds.length, 5, 'expected five builds');
    assert.equal(page.builds[4].name, 'oldest-build-branch', 'expected an earlier build to have been added');

    let build, commit;

    const branch = this.server.create('branch', {
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

    branch.lastBuild = build;
    branch.save();

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
    await app.pusher.receive('build:created', createdData);
    await settled();
    assert.equal(page.builds.length, 6, 'expected another build');

    page.builds[0].as(newBuild => {
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
    await app.pusher.receive('build:started', startedData);
    await settled();
    assert.ok(page.builds[0].started, 'expected the new build to show as started');

    const finishedData = {
      build: generatePusherPayload(build, { state: 'passed' }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository)
    };
    await app.pusher.receive('build:finished', finishedData);
    await settled();
    assert.ok(page.builds[0].passed, 'expected the newly-finished build to have passed');
  });

  test('renders no builds messaging when none present', async function (assert) {
    this.server.create('user', {
      login: 'travis-ci'
    });
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('repository', { owner: { login: 'travis-ci', id: 3 } });

    await page.visitBuildHistory({ organization: 'travis-ci', repo: 'travis-web' });

    assert.equal(page.showsNoBuildsMessaging, 'No builds for this repository', 'Build History tab shows no builds message');
  });
});
