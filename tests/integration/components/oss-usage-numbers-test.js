import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('oss-usage-numbers', 'Integration | Component | oss usage numbers', {
  integration: true
});

test('it renders correct images', function (assert) {
  this.set('numbers', 1000);
  this.render(hbs`{{oss-usage-numbers numbers=numbers}}`);

  assert.equal(this.$('img').length, 4, 'renders image for each digit');
});
