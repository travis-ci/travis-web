import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import branchesRepoTab from 'travis/tests/pages/repo-tabs/branches';

moduleForAcceptance('Acceptance | builds/branches tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('visiting /builds/branches-tab', assert => {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  // create branch
  server.create('branch', { active: true });
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository: repo, state: 'passed', commit_id: commit.id });
  build.createCommit();
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', build_id: build.id, commit_id: commit.id });
  // create log
  server.create('log', { id: job.id });

  branchesRepoTab
    .visit();

  andThen(() => {
    assert.ok(branchesRepoTab.branchesTabActive, 'Branches tab is active when visiting /org/repo/branches');
  });
});
