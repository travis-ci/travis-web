import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';
import jobPage from 'travis/tests/pages/job';

const repoId = 11120298;

const jobCreated = {"event":"job:created","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"log_id\":132172587,\"number\":\"15.1\",\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildCreated = {"event":"build:created","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"commit_id\":51613369,\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180838831,\"last_build_number\":\"14\",\"last_build_state\":\"passed\",\"last_build_duration\":53,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T21:59:53Z\",\"last_build_finished_at\":\"2016-12-02T22:00:46Z\",\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180838831}}","channel":"repo-11120298"}

const jobQueued = {"event":"job:queued","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"queued\",\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobReceived = {"event":"job:received","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"received\",\"started_at\":null,\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildStarted = {"event":"build:started","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"commit_id\":51613369,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180840191,\"last_build_number\":\"15\",\"last_build_state\":\"started\",\"last_build_duration\":null,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T22:04:10Z\",\"last_build_finished_at\":null,\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180840191}}","channel":"repo-11120298"}

const jobStarted = {"event":"job:started","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobLog1 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"another log line\",\"number\":1,\"final\":false}","channel":"job-180840192"}

const jobLog2 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"\\u001B[0K\\u001B[33;1mWorker information\",\"number\":0,\"final\":false}","channel":"job-180840192"}

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
    this.branch.createBuild(build);

    console.log('about to save this job', job);
    server.create('job', job);
  });

  andThen(() => {
    this.application.pusher.receive('job:created', JSON.parse(jobCreated.data));
  });

  andThen(() => {
    const newBuildCreated = JSON.parse(buildCreated.data);
    newBuildCreated.build = build;
    delete newBuildCreated.repository.last_build_id;
    delete newBuildCreated.repository.current_build_id;
    console.log('pushing this event', newBuildCreated, JSON.stringify(newBuildCreated));
    this.application.pusher.receive('build:created', newBuildCreated);
  });

  andThen(() => {
    this.application.pusher.receive('job:queued', JSON.parse(jobQueued.data));
  });

  andThen(() => {
    this.application.pusher.receive('job:received', JSON.parse(jobReceived.data));
  });

  // ACCORDING TO PAINSTAKING RESEARCH the new build will not show yet, but will after this
  // BECAUSE the repository’s current_build_id changes at this point.

  andThen(() => {
    server.create('log', { id: job.id });
  });

  andThen(() => {
    const newBuildStarted = JSON.parse(buildStarted.data);
    newBuildStarted.build = build;
    this.application.pusher.receive('build:started', newBuildStarted);
  });

  andThen(() => {
    assert.equal(dashboardPage.repoTitle, 'backspace / travixperiments-redux', 'the displayed repository should have changed');
  });

  andThen(() => {
    this.application.pusher.receive('job:started', JSON.parse(jobStarted.data));
    this.application.pusher.receive('job:log', JSON.parse(jobLog1.data));
    this.application.pusher.receive('job:log', JSON.parse(jobLog2.data));
  });

  andThen(() => {
    assert.equal(jobPage.logLines(0).text, 'Worker information');
    assert.ok(jobPage.logLines(0).isYellow, 'expected the first line to be yello');
  });
});
