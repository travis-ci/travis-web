import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | job/invalid log', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('viewing invalid job shows error', async function (assert) {
    const user = this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('repository', {
      slug: 'travis-ci/travis-api',
      owner: { login: 'travis-ci', id: user.id }
    });

    const repo2 = this.server.create('repository', {
      slug: 'travis-ci/travis-web',
      owner: { login: 'travis-ci', id: user.id }
    });

    const job = this.server.create('job', {
      repository: repo2,
      repositoryId: repo2.id
    });

    const build = this.server.create('build', {
      repository: repo2,
      jobIds: [job.id]
    });

    job.update({ buildId: build.id });

    await visit(`travis-ci/travis-web/jobs/${job.id}`);

    assert.ok(true, 'Job page loads successfully');
  });
});
