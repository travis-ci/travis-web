import { visit } from '@ember/test-helpers';
import Ember from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import buildPage from 'travis/tests/pages/build';

let adapterException;
let loggerError;

module('Acceptance | builds/invalid build', function (hooks) {
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

  test('viewing invalid build shows error', async function (assert) {
    // create incorrect repository as this is resolved first, errors otherwise
    server.create('repository', { slug: 'travis-ci/travis-api' });

    const repository = server.create('repository', { slug: 'travis-ci/travis-web' });
    const incorrectSlug = 'travis-ci/travis-api';
    const build = server.create('build', { repository });
    await visit(`${incorrectSlug}/builds/${build.id}`);

    assert.equal(buildPage.buildNotFoundMessage, 'Oops, we couldn\'t find that build!', 'Shows missing build message');
  });
});
