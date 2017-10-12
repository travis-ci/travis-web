import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trial-expired-notice', 'Integration | Component | trial expired notice', {
  integration: true
});

test('it renders', function (assert) {
  const config = {
    billingEndpoint: 'https://somewhere.billing',
    supportEmail: 'support@email.com'
  };
  this.set('config', config);
  this.render(hbs`{{trial-expired-notice org="travis-ci"}}`);
  assert.equal(this.$('.trial-warning').text().trim(), 'Looks like travis-ci\'s trial has expired');
  assert.equal(this.$('.trial-cta .button--blue').attr('href'), 'https://somewhere.billing');
  assert.equal(this.$('.trial-cta span a').attr('href'), 'support@email.com');
});
