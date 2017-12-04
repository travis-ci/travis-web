import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import sidebarPage from 'travis/tests/pages/sidebar';

moduleForAcceptance('Acceptance | home/sidebar tabs', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    // create active repo
    server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });

    // create active repo
    let testRepo = server.create('repository', {
      slug: 'killjoys/willful-subjects'
    });
    this.repo = testRepo;

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', {
      author: gitUser,
      committer: gitUser,
      branch: 'acceptance-tests',
      message: 'This is a message',
      branch_is_default: true
    });
    this.commit = commit;

    let build = server.create('build', {
      repository: testRepo,
      state: 'queued',
      commit,
      branch: server.create('branch', {
        name: 'acceptance-tests'
      })
    });
    this.build = build;

    let job = server.create('job', {
      number: '1234.1',
      repository: testRepo,
      state: 'queued',
      commit,
      build
    });
    this.job = job;

    commit.job = job;

    job.save();
    commit.save();
  }
});

test('the home page shows running tab in pro version', (assert) => {
  withFeature('pro-version');

  sidebarPage
    .visit()
    .clickSidebarRunningTab();

  andThen(() => {
    assert.equal(sidebarPage.sidebarRunningTabText, 'Running (0/1)', 'running tab correctly shows number of started/queued jobs');
    assert.equal(sidebarPage.sidebarRunningRepositories().count, 1, 'expected one running repositories');
  });
  percySnapshot(assert);
});

test('we query the API for all the jobs', function (assert) {
  withFeature('pro-version');

  // the default mirage limit is 10, so if we create 15 jobs for each queued and
  // started lists, the app code will have to do 2 queries
  server.createList('job', 15, { state: 'created', repository: this.repo, commit: this.commit, build: this.build });
  server.createList('job', 15, { state: 'started', repository: this.repo, commit: this.commit, build: this.build });

  sidebarPage
    .visit()
    .clickSidebarRunningTab();

  andThen(() => {
    assert.equal(sidebarPage.sidebarRunningTabText, 'Running (15/31)', 'running tab correctly shows number of started/queued jobs');
    assert.equal(sidebarPage.sidebarRunningRepositories().count, 31, 'expected one running repositories');
  });
});

test('maintains sidebar tab state when viewing running job in pro version', (assert) => {
  withFeature('pro-version');

  sidebarPage
    .visit()
    .clickSidebarRunningTab()
    .viewRunningJob();

  andThen(() => {
    assert.ok(sidebarPage.runningTabIsActive, 'running tab state should persist across route transitions');
  });
});
