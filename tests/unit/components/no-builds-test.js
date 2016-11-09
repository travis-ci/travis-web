import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('no-builds', {
  unit: true
});

// TODO: Replace with actual assertions
test('it renders', function (assert) {
  var component;
  assert.expect(2);
  component = this.subject();
  assert.equal(component._state, 'preRender');
  this.render();
  assert.equal(component._state, 'inDOM');
});
