import { visit } from '@ember/test-helpers';
import {Test, Logger} from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTestCustom } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import { setupMirage } from 'ember-cli-mirage/test-support';

let adapterException;
let loggerError;

module('Acceptance | job/invalid log', function (hooks) {
  setupApplicationTestCustom(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    adapterException = Test.adapter.exception;
    loggerError = Logger.error;
    Test.adapter.exception = () => {};
    Logger.error = () => null;
  });

  hooks.afterEach(function () {
    Test.adapter.exception = adapterException;
    Logger.error = loggerError;
  });

  test('viewing invalid job shows error', async function (assert) {
    // create incorrect repository as this is resolved first, errors otherwise
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('repository', { slug: 'travis-ci/travis-api', owner: { login: 'travis-ci', id: 1 } });

    const repository = this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } });
    const incorrectSlug = 'travis-ci/travis-api';
    const job = this.server.create('job', { repository });
    await visit(`${incorrectSlug}/jobs/${job.id}`);

    assert.equal(jobPage.jobNotFoundMessage, 'Oops, we couldn\'t find that job!', 'Shows missing job message');
  });
});
