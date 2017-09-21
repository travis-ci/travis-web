import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

let adapterException;
let loggerError;

moduleForAcceptance('Acceptance | job/invalid log', {
  beforeEach() {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  },

  afterEach() {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  }
});

test('viewing invalid job shows error', function (assert) {
  // create incorrect repository as this is resolved first, errors otherwise
  server.create('repository', { slug: 'travis-ci/travis-api' });

  const repository = server.create('repository', { slug: 'travis-ci/travis-web' });
  const incorrectSlug = 'travis-ci/travis-api';
  const job = server.create('job', { repository });
  visit(`${incorrectSlug}/jobs/${job.id}`);

  andThen(() => {
    assert.equal(jobPage.jobNotFoundMessage, 'Oops, we couldn\'t find that job!', 'Shows missing job message');
  });
});
