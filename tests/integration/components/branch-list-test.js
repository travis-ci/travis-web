import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('branch-list', 'Integration | Component | branch list', {
  integration: true
});

test('it renders', function (assert) {
  this.render(hbs`
    {{#branch-list listTitle="Test List"}}
      <p class="helptext">This is a branch list</p>
    {{/branch-list}}
  `);

  assert.equal(this.$().find('.helptext').text().trim(), 'This is a branch list');
  assert.equal(this.$().find('ul').text().trim(), 'No branches found.');
  assert.equal(this.$().find('h2').text().trim(), 'Test List');
});
