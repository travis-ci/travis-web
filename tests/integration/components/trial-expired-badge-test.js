import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trial-expired-badge', 'Integration | Component | trial expired badge', {
  integration: true
});

test('it renders', function (assert) {
  this.render(hbs`{{trial-expired-badge}}`);
  assert.equal(this.$('.message-label.badge').text().trim(), 'Trial expired');
});
