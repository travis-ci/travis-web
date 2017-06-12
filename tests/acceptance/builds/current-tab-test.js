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
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

  const branch = server.create('branch', { name: 'acceptance-tests' });
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', state: 'passed', repository, branch, commit });
  let job = server.create('job', { number: '1234.1', state: 'passed', build, commit, repository, config: { language: 'Hello' } });

  commit.update('build', build);
  commit.update('job', job);

  currentRepoTab
    .visit();

  andThen(() => {
    assert.equal(document.title, 'travis-ci/travis-web - Travis CI');
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
  });

  andThen(() => {
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

test('error message when build jobs array is empty', function (assert) {
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });
  const branch = server.create('branch', { name: 'accenptance-tests' });
  let build = server.create('build', { number: '5', state: 'passed', repository, branch });
  build.createCommit({ author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

  currentRepoTab.visit();

  andThen(function () {
    assert.ok(currentRepoTab.noJobsErrorMessage);
  });

  percySnapshot(assert);
});
