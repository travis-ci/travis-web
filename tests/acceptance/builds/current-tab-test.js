import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import currentRepoTab from 'travis/tests/pages/repo-tabs/current';
import jobTabs from 'travis/tests/pages/job-tabs';

moduleForAcceptance('Acceptance | builds/current tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('renders most recent repository without builds', function (assert) {
  server.create('repository', { slug: 'travis-ci/travis-web' });

  currentRepoTab
    .visit();

  andThen(function () {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    assert.equal(currentRepoTab.showsNoBuildsMessaging, 'No builds for this repository', 'Current tab shows no builds message');
  });
});

test('renders most recent repository and most recent build when builds present', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });

  server.create('branch', {});
  let build = server.create('build', { number: '5', repository: repo, state: 'passed' });
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', build_id: build.id, buildId: build.id, commit_id: commit.id, config: { language: 'Hello' } });

  build.update('commit', commit);
  commit.update('build', build);
  commit.update('job', job);

  currentRepoTab
    .visit();

  andThen(function () {
    assert.equal(document.title, 'travis-ci/travis-web - Travis CI');
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
  });

  andThen(function () {
    // TODO: This shouldn't be necessary. The cause for this test's
    // unreliability is that we assert before the build information has been
    // resolved. I'm actually not sure how this ever worked before.
    assert.ok(currentRepoTab.showsCurrentBuild, 'Shows current build');

    assert.ok(jobTabs.logTab.isShowing, 'Displays the log');
    assert.ok(jobTabs.configTab.isHidden, 'Job config is hidden');
  });

  jobTabs.configTab.click();

  andThen(function () {
    assert.equal(jobTabs.configTab.contents, '{ \"language\": \"Hello\" }', 'config output is correct');
    assert.ok(jobTabs.configTab.isShowing, 'Displays the job config');
    assert.ok(jobTabs.logTab.isHidden, 'Job log is hidden');
  });

  percySnapshot(assert);
});
