import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('loading-indicator', {
  unit: true
});

test('it renders', function(assert) {
  var component;
  component = this.subject({
    center: true
  });
  this.render();
  ok(component.$('span').hasClass('loading-indicator'), 'component has loading indicator class');
  return ok(component.$().hasClass('loading-container'), 'indicator gets parent class if centered flag is given');
});
