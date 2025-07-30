import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | licensing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /licensing', async function (assert) {
    await visit('/licensing');

    assert.equal(currentURL(), '/licensing');
    assert.dom('.content-page h1').hasText('Licensing Information');
    assert.dom('.content-page h2').hasText('EmberJS MIT License');
    assert.dom('.license-text').exists();
    assert.dom('.content-page').includesText('Travis CI relies on multiple Open-Source modules');
  });
});
