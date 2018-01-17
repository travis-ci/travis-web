import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('build-message', 'Integration | Component | build message', {
  integration: true
});

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  // FIXME this is hackish!
  this.set('message', { code: 'alias', args: [{}] });

  this.render(hbs`{{build-message message=message}}`);

  assert.equal(this.$().text().trim(), 'undefined is an alias for undefined, using undefined');
});
