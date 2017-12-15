import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';
import jobPage from 'travis/tests/pages/job';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';

const repoId = 100;

const repositoryTemplate = {
  id: repoId,
  slug: 'killjoys/living-a-feminist-life',
  owner: {
    login: 'killjoys'
  },
  name: 'living-a-feminist-life'
};

moduleForAcceptance('Acceptance | home/with repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    // create active repo
    this.repository = server.create('repository', repositoryTemplate);

    this.branch = this.repository.createBranch({
      name: 'primary',
    });

    server.create('repository', {
      slug: 'killjoys/queer-phenomenology'
    });

    // create active repo
    server.create('repository', {
      slug: 'killjoys/willful-subjects',
      owner: {
        login: 'killjoys'
      },
      name: 'willful-subjects'
    }).createBuild({
      id: 99,
      number: '1',
      state: 'passed',
      finished_at: '2017-03-27T12:00:01Z'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the home page shows the repositories', (assert) => {
  sidebarPage.visit();

  andThen(() => {
    assert.equal(sidebarPage.sidebarRepositories().count, 3, 'expected three repositories in the sidebar');
    assert.equal(sidebarPage.sidebarRepositories(0).name, 'killjoys/willful-subjects');
    assert.equal(sidebarPage.sidebarRepositories(1).name, 'killjoys/queer-phenomenology');
    assert.equal(sidebarPage.sidebarRepositories(2).name, 'killjoys/living-a-feminist-life');
  });
});

test('Pusher events change the main display', function (assert) {
  assert.expect(4);
  sidebarPage.visit();

  andThen(() => {
    assert.equal(sidebarPage.repoTitle, 'killjoys / willful-subjects', 'expected the displayed repository to be the one with a running build');
  });

  let  gitUser = server.create('git-user', { name: 'Sara Ahmed' });
  const commit = server.create('commit', {
    id: 100,
    sha: 'acab',
    branch: 'primary',
    message: 'Add new chapter',
    committed_at: '2016-12-02T22:02:34Z',
    author: gitUser,
  });

  const build = this.branch.createBuild({
    id: 100,
    number: 15,
    repository: this.repository,
    pull_request: false,
    event_type: 'push',
    state: 'passed',
    finished_at: '2017-03-27T12:00:00Z'
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

  andThen(() => {
    this.application.pusher.receive('job:created', generatePusherPayload(job));
    this.application.pusher.receive('build:created', {
      build: generatePusherPayload(build),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });

    this.application.pusher.receive('job:queued', generatePusherPayload(job, { state: 'queued' }));
    this.application.pusher.receive('job:received', generatePusherPayload(job, { state: 'received' }));

    // This is necessary to have the log fetch not fail and put the log in an error state.
    server.create('log', { id: job.id });

    build.state = 'started';
    build.finished_at = null;
    build.save();
    // After this line, the displayed repository should change, because it will
    // now have a running build
    this.application.pusher.receive('build:started', {
      build: generatePusherPayload(build, { state: 'started', finished_at: null }),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });
  });

  andThen(() => {
    assert.equal(sidebarPage.repoTitle, 'killjoys / living-a-feminist-life', 'the displayed repository should have changed');
  });

  andThen(() => {
    this.application.pusher.receive('job:started', generatePusherPayload(job, { state: 'started' }));

    this.application.pusher.receive('job:log', {
      id: job.id,
      number: 1,
      final: false,
      _log: 'another log line'
    });

    this.application.pusher.receive('job:log', {
      id: job.id,
      number: 0,
      final: false,
      _log: '\u001B[0K\u001B[33;1mThe first line'
    });
  });

  andThen(() => {
    assert.equal(jobPage.logLines(0).text, 'The first line');
    assert.ok(jobPage.logLines(0).isYellow, 'expected the first line to be yellow');
  });
});
