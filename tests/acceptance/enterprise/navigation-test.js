import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

let adapterException;

moduleForAcceptance('Acceptance | enterprise/navigation', {
  beforeEach() {
    adapterException = Ember.Test.adapter.exception;
    Ember.Test.adapter.exception = () => null;
  },

  afterEach() {
    Ember.Test.adapter.exception = adapterException;
  },
});

test('visiting `/` without being authenticated redirects to `/auth`', function (assert) {
  withFeature('enterpriseVersion');

  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/auth');
  });
});
