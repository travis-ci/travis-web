import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import { startMirage } from 'travis/initializers/ember-cli-mirage';
import wait from 'ember-test-helpers/wait';

moduleForComponent('enterprise-banner', 'Integration | Component | enterprise banner', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('renders trial banner', function (assert) {
  this.server.get('/v3/enterprise_license', (schema, response) => {
    return {
      'license_id': 'ad12345',
      'seats': '30',
      'active_users': '21',
      'license_type': 'trial',
      'expiration_time': '2020-01-01T00:00:00Z'
    };
  });
  assert.expect(2);

  this.render(hbs`{{enterprise-banner}}`);

  wait().then(() => {
    assert.ok(this.$('.enterprise-banner-trial').text().match(/Your trial license expires/));
    assert.ok(!this.$('.enterprise-banner-trial').hasClass('warning'));
  });
});
