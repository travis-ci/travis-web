import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';
import jobPage from 'travis/tests/pages/job';

const repoId = 11120298;

const repositoryTemplate = {
  id: repoId,
  slug: 'backspace/travixperiments-redux'
};

const commitTemplate = {
  id: 51613369,
  sha: '06f7deb064239a8ede7ae9f50a787594c6406f72',
  branch: 'primary',
  message: 'Add empty commit',
  committed_at: '2016-12-02T22:02:34Z',
  author_name: 'Buck Doyle',
  author_email: 'b@chromatin.ca'
};

// FIXME lodash? something? ugh?
const idlessCommitTemplate = Object.assign({}, commitTemplate);
delete idlessCommitTemplate.id;

commitTemplate.committer_name = commitTemplate.author_name;
commitTemplate.committer_email = commitTemplate.author_email;

const buildTemplate = {
  id: 180840191,
  repository_id: repositoryTemplate.id,
  number: 15,
  pull_request: false,
  event_type: 'push'
};

Object.assign(buildTemplate, idlessCommitTemplate);

const buildCreatedNew = Object.assign({}, buildTemplate);
buildCreatedNew.state = 'created';

const buildStartedNew = Object.assign({}, buildTemplate);
buildStartedNew.state = 'started';

repositoryTemplate.default_branch = {
  name: 'primary',
  last_build_id: buildTemplate.id
};

const repositoryWithNewBuild = Object.assign({}, repositoryTemplate);
repositoryWithNewBuild.current_build_id = buildTemplate.id;

const jobTemplate = {
  id: 180840192,
  repository_id: repoId,
  repository_slug: repositoryTemplate.slug,
  build_id: buildTemplate.id,
  commit_id: commitTemplate.id,
  // TODO what is this?
  log_id: 132172587,
  number: '15.1'
};

const jobCreatedNew = Object.assign({}, jobTemplate);
jobCreatedNew.state = 'created';

const jobQueuedNew = Object.assign({}, jobTemplate);
jobQueuedNew.state = 'queued';

const jobReceivedNew = Object.assign({}, jobTemplate);
jobReceivedNew.state = 'received';

const jobStartedNew = Object.assign({}, jobTemplate);
jobStartedNew.state = 'started';

buildTemplate.job_ids = [jobTemplate.id];

const jobLog1New = {
  id: jobTemplate.id,
  number: 1,
  final: false,
  _log: 'another log line'
};

const jobLog2New = {
  id: jobTemplate.id,
  number: 0,
  final: false,
  _log: '\u001B[0K\u001B[33;1mWorker information'
};

moduleForAcceptance('Acceptance | home/with repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    // create active repo
    const repository = server.create('repository', {
      slug: 'backspace/travixperiments-redux',
      id: 11120298
    });

    this.branch = repository.createBranch({
      name: 'primary'
    });

    // create active repo
    server.create('repository', {
      slug: 'killjoys/willful-subjects'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the home page shows the repositories', (assert) => {
  dashboardPage.visit();

  andThen(() => {
    assert.equal(dashboardPage.sidebarRepositories().count, 2, 'expected two repositories in the sidebar');
    assert.equal(dashboardPage.sidebarRepositories(0).name, 'killjoys/willful-subjects');
    assert.equal(dashboardPage.sidebarRepositories(1).name, 'killjoys/living-a-feminist-life');
  });
});

test('Pusher events change the main display', function (assert) {
  dashboardPage.visit();

  andThen(() => {
    assert.equal(dashboardPage.repoTitle, 'killjoys / willful-subjects', 'expected the displayed repository to be the newer one with no builds');
  });

  andThen(() => {
    this.branch.createBuild(buildCreatedNew);
    server.create('job', jobCreatedNew);
  });

  andThen(() => {
    this.application.pusher.receive('job:created', jobCreatedNew);
  });

  andThen(() => {
    this.application.pusher.receive('build:created', {
      build: buildCreatedNew,
      commit: commitTemplate,
      repository: repositoryTemplate
    });

    this.application.pusher.receive('job:queued', jobQueuedNew);
    this.application.pusher.receive('job:received', jobReceivedNew);
  });

  // ACCORDING TO PAINSTAKING RESEARCH the new build will not show yet, but will after this
  // BECAUSE the repository’s current_build_id changes at this point.

  andThen(() => {
    // This is necessary to have the log fetch not fail and put the log in an error state.
    server.create('log', { id: jobTemplate.id });
  });

  andThen(() => {
    this.application.pusher.receive('build:started', {
      build: buildStartedNew,
      commit: commitTemplate,
      repository: repositoryWithNewBuild
    });
  });

  andThen(() => {
    assert.equal(dashboardPage.repoTitle, 'backspace / travixperiments-redux', 'the displayed repository should have changed');
  });

  andThen(() => {
    this.application.pusher.receive('job:started', jobStartedNew);
    this.application.pusher.receive('job:log', jobLog1New);
    this.application.pusher.receive('job:log', jobLog2New);
  });

  andThen(() => {
    assert.equal(jobPage.logLines(0).text, 'Worker information');
    assert.ok(jobPage.logLines(0).isYellow, 'expected the first line to be yello');
  });
});
