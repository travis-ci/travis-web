import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('loading-indicator', 'Integration | Component | loading indicator', {
  integration: true
});

test('it renders', function (assert) {
  this.set('center', true);

  this.render(hbs`{{loading-indicator center=center}}`);

  assert.ok(this.$('span').hasClass('loading-indicator'), 'component has loading indicator class');
  assert.ok(this.$('div').hasClass('loading-container'), 'indicator gets parent class if centered flag is given');
});
