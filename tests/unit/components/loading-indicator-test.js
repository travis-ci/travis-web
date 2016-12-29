// TODO: Convert to integration test
import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('loading-indicator', {
  unit: true
});

test('it renders', function (assert) {
  const component = this.subject({
    center: true
  });
  this.render();
  assert.ok(component.$('span').hasClass('loading-indicator'), 'component has loading indicator class');
  assert.ok(component.$().hasClass('loading-container'), 'indicator gets parent class if centered flag is given');
});
