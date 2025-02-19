import {
  visit,
  waitFor,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | job/log error', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('handling log error', async function (assert) {
    assert.expect(5);

    let createdBy = this.server.create('user', { login: 'srivera', name: null });
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('allowance', {subscription_type: 1});

    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 2 } }),
      branch = this.server.create('branch', { name: 'acceptance-tests' });

    let commit = this.server.create('commit', { branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository, branch, commit, state: 'passed', createdBy });
    let job = this.server.create('job', { repository, commit, build, number: '1234.1', state: 'passed' });

    commit.job = job;

    job.save();
    commit.save();

    await visit(`/travis-ci/travis-web/jobs/${job.id}`);

    await waitFor('.job-log >  .notification-error');
    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.createdBy.text, 'srivera', 'expected the login to be used as a fallback');

    assert.equal(jobPage.logError, 'There was an error while trying to fetch the log.');
  });
});
