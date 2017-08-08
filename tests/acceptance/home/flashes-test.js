import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | home/flashes');

test('the flashes service displays flash messages', function (assert) {
  visit('/');
  this.application.__container__.lookup('service:flashes').success('TOTAL SUCCESS');

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'TOTAL SUCCESS');
    assert.ok(topPage.flashMessage.isSuccess, 'expected the flash message to have class `success`');
  });
});

test('the flashes service permits overriding the preamble', function (assert) {
  visit('/');
  this.application.__container__.lookup('service:flashes').notice('A notice!', 'Custom preamble');

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'A notice!');
    assert.equal(topPage.flashMessage.preamble, 'Custom preamble');
    assert.ok(topPage.flashMessage.isNotice, 'expected the flash message to have class `notice`');
  });
});
