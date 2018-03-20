import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'travis/initializers/ember-cli-mirage';
import config from 'travis/config/environment';
import { Response } from 'ember-cli-mirage';

module('Integration | Component | travis-status', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    config.statusPageStatusUrl = 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json';
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    config.statusPageStatusUrl = undefined;
    this.server.shutdown();
  });

  test('shows normal status when nothing wrong', async function(assert) {
    await render(hbs`{{travis-status}}`);

    return settled().then(() => {
      assert.ok(this.$('.status-circle').hasClass('none'), 'status class is set on .status-circle');
    });
  });

  test('shows unknown status when statuspage returns error', async function(assert) {
    this.server.get(config.statusPageStatusUrl, () => {
      return new Response(500, {}, {});
    });

    await render(hbs`{{travis-status}}`);

    return settled().then(() => {
      assert.ok(this.$('.status-circle').hasClass('unknown'), 'unknown status class is set on error');
    });
  });
});