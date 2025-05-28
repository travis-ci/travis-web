import { visit, click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | home/flashes', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('the flashes service displays flash messages', async function (assert) {
    this.owner.lookup('service:flashes').success('TOTAL SUCCESS');

    await visit('/');

    assert.dom('[data-test-flash-message-text]').hasText('TOTAL SUCCESS');
    assert.dom('[data-test-components-flash-item]').hasClass('success');
  });

  test('the flashes service permits overriding the preamble', async function (assert) {
    this.owner.lookup('service:flashes').warning('A notice!', 'Custom preamble');

    await visit('/');

    assert.dom('[data-test-components-flash-item]').hasClass('warning');
    assert.dom('[data-test-flash-message-text]').hasText('A notice!');
    assert.dom('[data-test-flash-message-preamble]').hasText('Custom preamble');
  });

  test('the flashes service has a loadFlashes interface', async function (assert) {
    // See here for an example of where this is used:
    // https://github.com/travis-ci/travis-api/blob/c4ae7cd2d7e403d4bf1649c3c7d1d5a68d871095/lib/travis/api/app/endpoint/jobs.rb#L33-L35

    this.owner.lookup('service:flashes').loadFlashes([{
      error: {
        message: 'An error message.'
      }
    }]);

    await visit('/');

    assert.dom('[data-test-flash-message-text]').hasText('An error message.');
    assert.dom('[data-test-flash-message-preamble]').hasText('Oh no!');
    assert.dom('[data-test-components-flash-item]').hasClass('error');
  });

  test('the most recent flash is the only one that displays but the old one is retained', async function (assert) {
    this.owner.lookup('service:flashes').error('An old error');
    this.owner.lookup('service:flashes').error('A new error');

    await visit('/');

    assert.dom('[data-test-flash-message-text]').hasText('A new error');

    await click('[data-test-components-flash-item] .close-banner');

    assert.dom('[data-test-flash-message-text]').hasText('An old error');
  });
});
