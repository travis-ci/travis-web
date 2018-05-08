import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | jobs/cancel', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('restarting job', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'running', commit });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'running', commit, build });
  commit.job = job;

  job.save();
  commit.save();

  server.create('log', { id: job.id });

  jobPage
    .visit()
    .cancelJob();

  andThen(function () {
    assert.equal(topPage.flashMessage.text, 'Job has been successfully cancelled.', 'cancelled job notification should be displayed');
  });
});
