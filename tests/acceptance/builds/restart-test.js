import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | builds/restart', {
  beforeEach() {
    const currentUser = server.create('user');
    let localStorageUser = JSON.parse(JSON.stringify(currentUser.attrs));
    localStorageUser.token = "abc123";
    window.localStorage.setItem('travis.token', 'testUserToken');
    window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
  },

  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('restarting build', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let branch = server.create('branch', {});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {number: '5', repository_id: repo.id, state: 'passed', commit_id: commit.id});
  let job = server.create('job', {number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit_id: commit.id});
  let log = server.create('log', { id: job.id });
  let repoId = parseInt(repo.id);
  server.create('permissions', {
    admin: [repoId],
    push: [repoId],
    pull: [repoId],
    permissions: [repoId],
  });

  buildPage
    .visit()
    .restartBuild();

  andThen(function() {
    assert.equal(buildPage.restartedNotification, 'The build was successfully restarted.', 'restarted notification should display proper build restarted text');
  });
});
