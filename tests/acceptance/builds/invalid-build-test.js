import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import startApp from '../../helpers/start-app';
import buildPage from 'travis/tests/pages/build';

let adapterException;
moduleForAcceptance('Acceptance | builds/invalid build', {
  beforeEach() {
    this.application = startApp();
    adapterException = Ember.Test.adapter.exception;
    Ember.Test.adapter.exception = () => {};
  },

  afterEach() {
    Ember.Test.adapter.exception = adapterException;
    Ember.run(this.application, 'destroy');
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
