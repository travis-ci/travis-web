import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';

const repoId = 11120298;

const jobCreated = {"event":"job:created","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"log_id\":132172587,\"number\":\"15.1\",\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildCreated = {"event":"build:created","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"created\",\"started_at\":null,\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"commit_id\":51613369,\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180838831,\"last_build_number\":\"14\",\"last_build_state\":\"passed\",\"last_build_duration\":53,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T21:59:53Z\",\"last_build_finished_at\":\"2016-12-02T22:00:46Z\",\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180838831}}","channel":"repo-11120298"}

const jobQueued = {"event":"job:queued","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"queued\",\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobReceived = {"event":"job:received","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"received\",\"started_at\":null,\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const buildStarted = {"event":"build:started","data":"{\"build\":{\"id\":180840191,\"repository_id\":11120298,\"commit_id\":51613369,\"number\":\"15\",\"pull_request\":false,\"pull_request_title\":null,\"pull_request_number\":null,\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"duration\":null,\"job_ids\":[180840192],\"event_type\":\"push\",\"commit\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\"},\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"},\"repository\":{\"id\":11120298,\"slug\":\"backspace/travixperiments-redux\",\"description\":\"Was it stolen by staging? IT SEEMS SO\",\"private\":false,\"last_build_id\":180840191,\"last_build_number\":\"15\",\"last_build_state\":\"started\",\"last_build_duration\":null,\"last_build_language\":null,\"last_build_started_at\":\"2016-12-02T22:04:10Z\",\"last_build_finished_at\":null,\"github_language\":null,\"default_branch\":{\"name\":\"primary\",\"last_build_id\":180840191},\"active\":true,\"current_build_id\":180840191}}","channel":"repo-11120298"}

const jobStarted = {"event":"job:started","data":"{\"id\":180840192,\"repository_id\":11120298,\"repository_slug\":\"backspace/travixperiments-redux\",\"repository_private\":false,\"build_id\":180840191,\"commit_id\":51613369,\"number\":\"15.1\",\"state\":\"started\",\"started_at\":\"2016-12-02T22:04:10Z\",\"finished_at\":null,\"queue\":\"builds.docker\",\"allow_failure\":false,\"commit\":{\"id\":51613369,\"sha\":\"06f7deb064239a8ede7ae9f50a787594c6406f72\",\"branch\":\"primary\",\"message\":\"Add empty commit\",\"committed_at\":\"2016-12-02T22:02:34Z\",\"author_name\":\"Buck Doyle\",\"author_email\":\"b@chromatin.ca\",\"committer_name\":\"Buck Doyle\",\"committer_email\":\"b@chromatin.ca\",\"compare_url\":\"https://github.com/backspace/travixperiments-redux/compare/844804c7d8a1...06f7deb06423\"}}","channel":"repo-11120298"}

const jobLog1 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"\\r\\ncouchdb 1.6.1\\r\\n\\u001B[34m\\u001B[1mNeo4j version\\u001B[0m\\r\\n1.9.4\\r\\n\\u001B[34m\\u001B[1mRabbitMQ Version\\u001B[0m\\r\\n3.4.3\\r\\n\\u001B[34m\\u001B[1mElasticSearch version\\u001B[0m\\r\\n1.4.0\\r\\n\\u001B[34m\\u001B[1mInstalled Sphinx versions\\u001B[0m\\r\\n2.0.10\\r\\n2.1.9\\r\\n2.2.6\\r\\n\\u001B[34m\\u001B[1mDefault Sphinx version\\u001B[0m\\r\\n2.2.6\\r\\n\\u001B[34m\\u001B[1mInstalled Firefox version\\u001B[0m\\r\\nfirefox 31.0esr\\r\\n\\u001B[34m\\u001B[1mPhantomJS version\\u001B[0m\\r\\n1.9.8\\r\\n\\u001B[34m\\u001B[1mant -version\\u001B[0m\\r\\nApache Ant(TM) version 1.8.2 compiled on December 3 2011\\r\\n\\u001B[34m\\u001B[1mmvn -version\\u001B[0m\\r\\nApache Maven 3.2.5 (12a6b3acb947671f09b81f49094c53f426d8cea1; 2014-12-14T17:29:23+00:00)\\r\\nMaven home: /usr/local/maven\\r\\nJava version: 1.7.0_76, vendor: Oracle Corporation\\r\\nJava home: /usr/lib/jvm/java-7-oracle/jre\\r\\nDefault locale: en_US, platform encoding: ANSI_X3.4-1968\\r\\nOS name: \\\"linux\\\", version: \\\"3.13.0-29-generic\\\", arch: \\\"amd64\\\", family: \\\"unix\\\"\\r\\ntravis_fold:end:system_info\\r\\u001B[0K\\r\\ntravis_fold:start:fix.CVE-2015-7547\\r\\u001B[0K$ export DEBIAN_FRONTEND=noninteractive\\r\\n\",\"number\":1,\"final\":false}","channel":"job-180840192"}

const jobLog2 = {"event":"job:log","data":"{\"id\":180840192,\"_log\":\"travis_fold:start:worker_info\\r\\u001B[0K\\u001B[33;1mWorker information\\u001B[0m\\nhostname: i-c9697f5a-precise-production-2-worker-org-docker.travisci.net:f5bdc754-76ed-479f-9ed9-8b241da2c50b\\nversion: v2.5.0-8-g19ea9c2 https://github.com/travis-ci/worker/tree/19ea9c20425c78100500c7cc935892b47024922c\\ninstance: 11138e1:travis:ruby\\nstartup: 1.424029874s\\ntravis_fold:end:worker_info\\r\\u001B[0Ktravis_fold:start:system_info\\r\\u001B[0K\\u001B[33;1mBuild system information\\u001B[0m\\r\\nBuild language: ruby\\r\\nBuild group: stable\\r\\nBuild dist: precise\\r\\nBuild id: 180840191\\r\\nJob id: 180840192\\r\\ntravis-build version: 557e4084f\\r\\n\\u001B[34m\\u001B[1mBuild image provisioning date and time\\u001B[0m\\r\\nThu Feb  5 15:09:33 UTC 2015\\r\\n\\u001B[34m\\u001B[1mOperating System Details\\u001B[0m\\r\\nDistributor ID:\\tUbuntu\\r\\nDescription:\\tUbuntu 12.04.5 LTS\\r\\nRelease:\\t12.04\\r\\nCodename:\\tprecise\\r\\n\\u001B[34m\\u001B[1mLinux Version\\u001B[0m\\r\\n3.13.0-29-generic\\r\\n\\u001B[34m\\u001B[1mCookbooks Version\\u001B[0m\\r\\na68419e https://github.com/travis-ci/travis-cookbooks/tree/a68419e\\r\\n\\u001B[34m\\u001B[1mGCC version\\u001B[0m\\r\\ngcc (Ubuntu/Linaro 4.6.3-1ubuntu5) 4.6.3\\r\\nCopyright (C) 2011 Free Software Foundation, Inc.\\r\\nThis is free software; see the source for copying conditions.  There is NO\\r\\nwarranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\\r\\n\\r\\n\\u001B[34m\\u001B[1mLLVM version\\u001B[0m\\r\\nclang version 3.4 (tags/RELEASE_34/final)\\r\\nTarget: x86_64-unknown-linux-gnu\\r\\nThread model: posix\\r\\n\\u001B[34m\\u001B[1mPre-installed Ruby versions\\u001B[0m\\r\\nruby-1.9.3-p551\\r\\n\\u001B[34m\\u001B[1mPre-installed Node.js versions\\u001B[0m\\r\\nv0.10.36\\r\\n\\u001B[34m\\u001B[1mPre-installed Go versions\\u001B[0m\\r\\n1.4.1\\r\\n\\u001B[34m\\u001B[1mRedis version\\u001B[0m\\r\\nredis-server 2.8.19\\r\\n\\u001B[34m\\u001B[1mriak version\\u001B[0m\\r\\n2.0.2\\r\\n\\u001B[34m\\u001B[1mMongoDB version\\u001B[0m\\r\\nMongoDB 2.4.12\\r\\n\\u001B[34m\\u001B[1mCouchDB version\\u001B[0m\",\"number\":0,\"final\":false}","channel":"job-180840192"}

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

  andThen(() => {
    console.log('about to save this build', build);
    this.branch.createBuild(build);

    const job = JSON.parse(jobCreated.data);
    delete job.commit;
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
    const newBuildStarted = JSON.parse(buildStarted.data);
    newBuildStarted.build = build;
    this.application.pusher.receive('build:started', newBuildStarted);
  });

  andThen(() => {
    assert.equal(dashboardPage.repoTitle, 'backspace / travixperiments-redux', 'the displayed repository should have changed');
  });
});
