import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import currentRepoTab from 'travis/tests/pages/repo-tabs/current';

moduleForAcceptance('Acceptance | builds/current tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('renders most recent repository without builds', assert => {
  server.create('repository', { slug: 'travis-ci/travis-web' });

  currentRepoTab
    .visit();

  andThen(() => {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
    assert.equal(currentRepoTab.showsNoBuildsMessaging, 'No builds for this repository', 'Current tab shows no builds message');
  });
});

test('renders most recent repository and most recent build when builds present', assert => {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  // create branch
  server.create('branch', {});
  let build = server.create('build', { number: '5', repository: repo, state: 'passed' });
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', build_id: build.id, commit_id: commit.id });
  // create branch
  server.create('log', { id: job.id });

  build.update('commit', commit);
  commit.update('build', build);

  currentRepoTab
    .visit();

  andThen(() => {
    assert.ok(currentRepoTab.currentTabActive, 'Current tab is active by default when loading dashboard');
  });

  andThen(() => {
    // TODO: This shouldn't be necessary. The cause for this test's
    // unreliability is that we assert before the build information has been
    // resolved. I'm actually not sure how this ever worked before.
    assert.ok(currentRepoTab.showsCurrentBuild, 'Shows current build');
  });
});
