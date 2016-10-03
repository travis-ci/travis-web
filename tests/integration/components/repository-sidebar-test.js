import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('repository-sidebar', 'Integration | Component | repository sidebar', {
  integration: true
});

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{repository-sidebar}}`);

  assert.equal(this.$().text().trim().split('\n')[0], 'My Repositories');
});
