import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | builds/cancel', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('cancelling build', function (assert) {
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

  let branch = server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
  let commit = server.create('commit', { sha: 'abc1111', author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', message: 'This is a message' });
  let build = server.create('build', { number: '5', state: 'started', repository, commit, branch });
  let job = server.create('job', { number: '1234.1', state: 'started', repository, commit, build });

  server.create('log', {
    id: job.id
  });

  buildPage
    .visit({ slug: 'travis-ci/travis-web', build_id: build.id })
    .cancelBuild();

  andThen(function () {
    assert.equal(buildPage.notification, 'Build has been successfully cancelled.', 'cancelled build notification should be displayed');
  });
});
