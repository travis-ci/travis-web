import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | enterprise banner', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('renders seats banner nearing excess', async function (assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => ({
      'license_id': 'ad12345',
      'seats': '30',
      'active_users': '26',
      'license_type': 'paid',
      'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8).toISOString()
    }));
    assert.expect(1);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.dom('.enterprise-banner-seats').hasText(/You’re approaching the maximum seats that your license permits/);
    });
  });

  test('renders seats banner exceeding', async function (assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => ({
      'license_id': 'ad12345',
      'seats': '30',
      'active_users': '47',
      'license_type': 'paid',
      'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8).toISOString()
    }));
    assert.expect(1);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.dom('.enterprise-banner-seats').hasText(/You’ve exceeded the maximum seats that your license permits/);
    });
  });
});
