import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

let adapterException;
let loggerError;

moduleForAcceptance('Acceptance | builds/invalid build', {
  beforeEach() {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  },

  afterEach() {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  },
});

test('viewing invalid build shows error', function (assert) {
  // create incorrect repository as this is resolved first, errors otherwise
  server.create('repository', { slug: 'travis-ci/travis-api' });

  const repository = server.create('repository', { slug: 'travis-ci/travis-web' });
  const incorrectSlug = 'travis-ci/travis-api';
  const build = server.create('build', { repository });
  visit(`${incorrectSlug}/builds/${build.id}`);

  andThen(() => {
    assert.equal(buildPage.buildNotFoundMessage, 'Oops, we couldn\'t find that build!', 'Shows missing build message');
  });
});
