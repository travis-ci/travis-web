import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';

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

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });

    let commit = server.create('commit', {
      author_email: 'mrt@travis-ci.org',
      author_name: 'Mr T',
      committer_email: 'mrt@travis-ci.org',
      committer_name: 'Mr T',
      branch: 'acceptance-tests',
      message: 'This is a message',
      branch_is_default: true
    });

    let build = server.create('build', {
      repository: testRepo,
      state: 'queued',
      commit
    });

    let job = server.create('job', {
      number: '1234.1',
      repository: testRepo,
      state: 'queued',
      commit,
      build
    });

    commit.job = job;

    job.save();
    commit.save();
  }
});

test('the home page shows running tab in pro version', (assert) => {
  withFeature('pro-version');

  dashboardPage
    .visit()
    .clickSidebarRunningTab();

  andThen(() => {
    assert.equal(dashboardPage.sidebarRunningRepositories().count, 1, 'expected no running repositories');
  });
  percySnapshot(assert);
});

test('maintains sidebar tab state when viewing running job in pro version', (assert) => {
  withFeature('pro-version');

  dashboardPage
    .visit()
    .clickSidebarRunningTab()
    .viewRunningJob();

  andThen(() => {
    assert.ok(dashboardPage.runningTabIsActive, 'running tab state should persist across route transitions');
  });
});
