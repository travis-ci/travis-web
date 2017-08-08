import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | home/flashes');

test('the flashes service displays flash messages', function (assert) {
  visit('/');
  this.application.__container__.lookup('service:flashes').success('TOTAL SUCCESS');

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'TOTAL SUCCESS');
  });
});
