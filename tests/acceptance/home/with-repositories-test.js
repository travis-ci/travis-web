import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { settled, visit, getContext } from '@ember/test-helpers';
import sidebarPage from 'travis/tests/pages/sidebar';
import jobPage from 'travis/tests/pages/job';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { prettyDate } from 'travis/helpers/pretty-date';
import { setupMirage } from 'ember-cli-mirage/test-support';

const repoId = 100;

const repositoryTemplate = {
  id: repoId,
  slug: 'org-login/repository-name',
  owner: {
    login: 'org-login'
  },
  name: 'repository-name'
};

module('Acceptance | home/with repositories', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    signInUser(currentUser);

    // create active repo
    this.repository = this.server.create('repository', repositoryTemplate);

    this.branch = this.repository.createBranch({
      name: 'primary',
    });

    this.server.create('repository', {
      slug: 'org-login/some-other-repository-name'
    });

    // create active repo
    let oneYearAgo = new Date(new Date() - 1000 * 60 * 60 * 24 * 365);
    let beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 19 - 1000 * 19);

    this.startedAt = beforeOneYearAgo.toISOString();
    this.finishedAt = oneYearAgo.toISOString();

    this.server.create('repository', {
      slug: 'org-login/yet-another-repository-name',
      owner: {
        login: 'org-login'
      },
      name: 'yet-another-repository-name'
    }).createBuild({
      id: 99,
      number: '1',
      state: 'passed',
      started_at: this.startedAt,
      finished_at: this.finishedAt
    });

    this.server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  });

  test('the home page shows the repositories', async function (assert) {
    await visit('/');
    await settled();

    assert.equal(sidebarPage.sidebarRepositories.length, 3, 'expected three repositories in the sidebar');

    sidebarPage.sidebarRepositories[0].as(yetAnother => {
      assert.equal(yetAnother.name, 'org-login/yet-another-repository-name');
      assert.equal(yetAnother.duration.text, '19 min 19 sec');
      assert.equal(yetAnother.duration.title, `Started ${prettyDate([this.startedAt])}`);
      assert.equal(yetAnother.finished.text, 'about a year ago');
      assert.equal(yetAnother.finished.title, `Finished ${prettyDate([this.finishedAt])}`);
    });

    sidebarPage.sidebarRepositories[1].as(someOther => {
      assert.equal(someOther.name, 'org-login/some-other-repository-name');
      assert.equal(someOther.duration.text, '-');
      assert.notOk(someOther.duration.title);
      assert.notOk(someOther.finished.isVisible);
    });

    assert.equal(sidebarPage.sidebarRepositories[2].name, 'org-login/repository-name');
  });

  test('Pusher events change the main display', async function (assert) {
    assert.expect(5);
    await visit('/');
    await settled();

    assert.equal(sidebarPage.repoTitle, 'org-login / yet-another-repository-name', 'expected the displayed repository to be the one with a running build');

    let createdBy = this.server.create('user', { login: 'srivera', name: 'Sylvia Rivera' });

    const commit = this.server.create('commit', {
      id: 100,
      sha: 'acab',
      branch: 'primary',
      message: 'Add new chapter',
      committed_at: '2016-12-02T22:02:34Z',
    });

    const build = this.branch.createBuild({
      id: 100,
      number: 15,
      repository: this.repository,
      pull_request: false,
      event_type: 'push',
      state: 'passed',
      finished_at: '2017-03-27T12:00:00Z',
      createdBy
    });
    this.branch.lastBuild = build;
    this.branch.save();

    const job = build.createJob({
      id: 100,
      repository: this.repository,
      build,
      commit,
      number: '15.1',
      state: 'passed',
      finished_at: '2017-03-27T12:00:00Z'
    });

    this.repository.defaultBranch = this.branch;
    this.repository.save();

    const { owner } = getContext();
    const app = owner.application;

    app.pusher.receive('job:created', generatePusherPayload(job));
    app.pusher.receive('build:created', {
      build: generatePusherPayload(build),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });

    app.pusher.receive('job:queued', generatePusherPayload(job, { state: 'queued' }));
    app.pusher.receive('job:received', generatePusherPayload(job, { state: 'received' }));

    // This is necessary to have the log fetch not fail and put the log in an error state.
    this.server.create('log', { id: job.id, content: ''});

    build.state = 'started';
    build.finished_at = null;
    build.save();
    // After this line, the displayed repository should change, because it will
    // now have a running build
    await app.pusher.receive('build:started', {
      build: generatePusherPayload(build, { state: 'started', finished_at: null }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });
    await settled();
    assert.equal(sidebarPage.repoTitle, 'org-login / repository-name', 'the displayed repository should have changed');
    assert.equal(jobPage.createdBy.text, 'Sylvia Rivera');
    await app.pusher.receive('job:started', generatePusherPayload(job, { state: 'started' }));

    await app.pusher.receive('job:log', {
      id: job.id,
      number: 1,
      final: false,
      _log: 'another log line'
    });

    await app.pusher.receive('job:log', {
      id: job.id,
      number: 0,
      final: false,
      _log: '\u001B[0K\u001B[33;1mThe first line'
    });

    await settled();
    assert.equal(jobPage.logLines[0].entireLineText, 'The first line');
    assert.ok(jobPage.logLines[0].isYellow, 'expected the first line to be yellow');
  });
});
