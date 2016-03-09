import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | dashboard view test');

test('visiting /dashboard-view-test', function(assert) {

  visit('/dashboard');

  andThen(function() {
    assert.equal(currentURL(), '/dashboard');
  });
});
