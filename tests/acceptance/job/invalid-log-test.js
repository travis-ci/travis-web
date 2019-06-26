import { visit } from '@ember/test-helpers';
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import jobPage from 'travis/tests/pages/job';

let adapterException;
let loggerError;

module('Acceptance | job/invalid log', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  });

  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });

  test('viewing invalid job shows error', async function (assert) {
    // create incorrect repository as this is resolved first, errors otherwise
    server.create('repository', { slug: 'travis-ci/travis-api' });

    const repository = server.create('repository', { slug: 'travis-ci/travis-web' });
    const incorrectSlug = 'travis-ci/travis-api';
    const job = server.create('job', { repository });
    await visit(`${incorrectSlug}/jobs/${job.id}`);

    assert.equal(jobPage.jobNotFoundMessage, 'Oops, we couldn\'t find that job!', 'Shows missing job message');
  });
});
