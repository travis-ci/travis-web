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

test('the flashes service has a loadFlashes interface', function (assert) {
  // See here for an example of where this is used:
  // https://github.com/travis-ci/travis-api/blob/c4ae7cd2d7e403d4bf1649c3c7d1d5a68d871095/lib/travis/api/app/endpoint/jobs.rb#L33-L35

  visit('/');
  this.application.__container__.lookup('service:flashes').loadFlashes([{
    error: {
      message: 'An error message.'
    }
  }]);

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'An error message.');
    assert.equal(topPage.flashMessage.preamble, 'Oh no!');
    assert.ok(topPage.flashMessage.isError, 'expected the flash message to have class `error`');
  });
});
