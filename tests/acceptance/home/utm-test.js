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
import config from 'travis/config/environment';

const { utmParametersResetDelay } = config.timing;

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

  hooks.beforeEach(function () {
    this.utm = this.owner.lookup('service:utm');
  });

  hooks.afterEach(function () {
    this.utm.removeFromStorage();
  });

  test('utm query params get captured', async function (assert) {
    await visit(INITIAL_URL);
    await settled();
    await timeout(utmParametersResetDelay);

    const { campaign, content, medium, source, term } = this.utm;

    assert.equal(currentURL(), '/');
    assert.equal(campaign, TEST_DATA[UTM_FIELDS.CAMPAIGN]);
    assert.equal(content, TEST_DATA[UTM_FIELDS.CONTENT]);
    assert.equal(medium, TEST_DATA[UTM_FIELDS.MEDIUM]);
    assert.equal(source, TEST_DATA[UTM_FIELDS.SOURCE]);
    assert.equal(term, TEST_DATA[UTM_FIELDS.TERM]);
  });
});
