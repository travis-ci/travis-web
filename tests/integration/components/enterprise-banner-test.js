import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';

module('Integration | Component | enterprise banner', function(hooks) {
  setupRenderingTest(hooks);

  test('renders trial banner unexpired', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': new Date(new Date().getTime() + 1000).toISOString()
      };
    });
    assert.expect(2);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-trial').text().match(/Your trial license expires/));
      assert.notOk(this.$('.enterprise-banner-trial').hasClass('alert'));
    });
  });

  test('renders trial banner expired', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString()
      };
    });
    assert.expect(2);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-trial').text().match(/Your trial license has expired/));
      assert.notOk(this.$('.enterprise-banner-trial').hasClass('alert'));
    });
  });

  test('renders paid banner 60 days from expiry', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'paid',
        'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 59).toISOString()
      };
    });
    assert.expect(3);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-license').text().match(/Your license expires 2 months from now/));
      assert.ok(this.$('.enterprise-banner-license').hasClass('alert'));
      assert.ok(this.$('.enterprise-banner-license button').length);
    });
  });

  test('renders paid banner 30 days from expiry', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'paid',
        'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 26).toISOString()
      };
    });
    assert.expect(3);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-license').text().match(/Your license expires 26 days from now/));
      assert.ok(this.$('.enterprise-banner-license').hasClass('alert'));
      assert.ok(this.$('.enterprise-banner-license button').length);
    });
  });

  test('renders paid banner 10 days from expiry', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'paid',
        'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8).toISOString()
      };
    });
    assert.expect(3);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-license').text().match(/Your license expires 8 days from now/));
      assert.ok(this.$('.enterprise-banner-license').hasClass('alert'));
      assert.notOk(this.$('.enterprise-banner-license button').length);
    });
  });

  test('renders seats banner nearing excess', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '26',
        'license_type': 'paid',
        'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8).toISOString()
      };
    });
    assert.expect(2);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-seats').text().match(/You’re approaching the maximum seats that your license permits/));
      assert.ok(this.$('.enterprise-banner-seats').hasClass('alert'));
    });
  });

  test('renders seats banner exceeding', async function(assert) {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '47',
        'license_type': 'paid',
        'expiration_time': new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8).toISOString()
      };
    });
    assert.expect(2);

    await render(hbs`{{enterprise-banner}}`);

    settled().then(() => {
      assert.ok(this.$('.enterprise-banner-seats').text().match(/You’ve exceeded the maximum seats that your license permits/));
      assert.ok(this.$('.enterprise-banner-seats').hasClass('alert'));
    });
  });
});
