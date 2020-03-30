import {
  currentURL,
  settled,
  visit,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { UTM_FIELDS } from 'travis/services/utm';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { timeout } from 'ember-concurrency';

import { RESET_UTM_PARAMS_DELAY } from 'travis/routes/application';

const TEST_DATA = {
  [UTM_FIELDS.CAMPAIGN]: 'ca1',
  [UTM_FIELDS.CONTENT]: 'co2',
  [UTM_FIELDS.MEDIUM]: 'me3',
  [UTM_FIELDS.SOURCE]: 'so4',
  [UTM_FIELDS.TERM]: 'te5',
};
const TEST_QUERY_PARAMS = Object.entries(TEST_DATA).map(([key, val]) => `${key}=${val}`);
const INITIAL_URL = `/?${TEST_QUERY_PARAMS.join('&')}`;

module('Acceptance | utm capture', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('utm query params get captured', async function (assert) {
    await visit(INITIAL_URL);
    await settled();
    await timeout(RESET_UTM_PARAMS_DELAY);

    const { campaign, content, medium, source, term } = this.owner.lookup('service:utm');

    assert.equal(currentURL(), '/');
    assert.equal(campaign, TEST_DATA[UTM_FIELDS.CAMPAIGN]);
    assert.equal(content, TEST_DATA[UTM_FIELDS.CONTENT]);
    assert.equal(medium, TEST_DATA[UTM_FIELDS.MEDIUM]);
    assert.equal(source, TEST_DATA[UTM_FIELDS.SOURCE]);
    assert.equal(term, TEST_DATA[UTM_FIELDS.TERM]);
  });
});
