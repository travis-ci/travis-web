import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import config from 'travis/config/environment';
import { Response } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | travis-status', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    config.statusPageStatusUrl = 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json';
  });

  hooks.afterEach(function () {
    config.statusPageStatusUrl = undefined;
  });

  // test('shows normal status when nothing wrong', async function (assert) {
  // await render(hbs`{{travis-status}}`);

  // return settled().then(() => {
  // assert.dom('.travis-status').hasClass('none', 'status class is set on travis-status');
  // });
  // });

  test('shows unknown status when statuspage returns error', async function (assert) {
    this.server.get(config.statusPageStatusUrl, () => {
      return new Response(500, {}, {});
    });

    await render(hbs`{{travis-status}}`);

    return settled().then(() => {
      assert.dom('.travis-status').hasClass('unknown', 'unknown status class is set on error');
    });
  });
});
