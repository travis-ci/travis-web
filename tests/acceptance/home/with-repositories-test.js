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

const jobCreated = {"event":"job:created","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"log_id\":132172587,\"number\":\"15.1\",\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildCreated = {"event":"build:created","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"commit_id\":51613369,\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180838831,\"last_build_number\":\"14\",\"last_build_state\":\"passed\",\"last_build_duration\":53,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T21:59:53Z\",\"last_build_finished_at\":\"2016-12-02T22:00:46Z\",\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180838831}}","channel":"repo-11120298"}

const jobQueued = {"event":"job:queued","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"queued\",\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobReceived = {"event":"job:received","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"received\",\"started_at\":null,\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildStarted = {"event":"build:started","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"commit_id\":51613369,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180840191,\"last_build_number\":\"15\",\"last_build_state\":\"started\",\"last_build_duration\":null,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T22:04:10Z\",\"last_build_finished_at\":null,\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180840191}}","channel":"repo-11120298"}

const jobStarted = {"event":"job:started","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobLog1 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"another log line\",\"number\":1,\"final\":false}","channel":"job-180840192"}

const jobLog2 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"\\u001B[0K\\u001B[33;1mWorker information\",\"number\":0,\"final\":false}","channel":"job-180840192"}

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

  const build = JSON.parse(buildCreated.data).build;
  delete build.commit;
  delete build.last_build_id;
  delete build.current_build_id;

  const job = JSON.parse(jobCreated.data);
  delete job.commit;

  andThen(() => {
    console.log('about to save this build', build);
    this.branch.createBuild(buildCreatedNew);

    console.log('about to save this job', job);
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
    server.create('log', { id: job.id });
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
