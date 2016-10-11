import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('subscription-status-banner', 'Integration | Component | subscription status banner', {
  integration: true
});

test('it renders', function (assert) {
  this.render(hbs`{{subscription-status-banner color='green' message='Ohai' billingLinkText='Click' billingUrl='lol'}}`);

  assert.ok(this.$().find('p').hasClass('notice-banner--green'), 'it generates the correct class name');
  assert.equal(this.$().text().trim(), 'Ohai Click', 'it renders correct message and link text');
  assert.equal(this.$().find('a').attr('href'), 'lol', 'it renders the correct href');
});
