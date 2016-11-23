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

  server.create('branch', {});
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'running', commit });
  let job = server.create('job', { number: '1234.1', repository, state: 'running', build, commit });

  server.create('log', { id: job.id });

  buildPage
    .visit()
    .cancelBuild();

  andThen(function () {
    assert.equal(buildPage.notification, 'Build has been successfully cancelled.', 'cancelled build notification should be displayed');
  });
});
