import { currentURL } from '@ember/test-helpers';
import { visitWithAbortedTransition } from 'travis/tests/helpers/visit-with-aborted-transition';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | non existent routes', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /some/non-existent/route', async function (assert) {
    await visitWithAbortedTransition('/some/non-existent/route');

    assert.equal(currentURL(), '/some/non-existent/route');
    assert.dom('[data-test-error-404-header]').hasText('404: Something\'s Missing');
    assert.dom('[data-test-error-404-subheader]').hasText('We\'re sorry! It seems like this page cannot be found.');
  });
});
