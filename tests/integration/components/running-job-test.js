import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('running-job', 'Integration | Component | running job', {
  integration: true
});

test('it renders', function (assert) {
  this.render(hbs`{{running-job}}`);
  assert.equal(this.$().text().trim(), '');
});
