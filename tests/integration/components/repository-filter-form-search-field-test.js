import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('repository-filter-form-search-field', 'Integration | Component | repository filter form search field', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{repository-filter-form-search-field}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#repository-filter-form-search-field}}
      template block text
    {{/repository-filter-form-search-field}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
