import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | non existent routes', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /some/non-existent/route', async function(assert) {
    await visit('/some/non-existent/route');

    assert.equal(currentURL(), '/some/non-existent/route');
    assert.dom('[data-test-error-404-header]').hasText('404: Something\'s Missing');
    assert.dom('[data-test-error-404-subheader]').hasText('We\'re sorry! It seems like this page cannot be found.');
  });
});
