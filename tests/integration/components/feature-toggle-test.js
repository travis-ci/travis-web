import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feature-toggle', 'Integration | Component | feature toggle', {
  integration: true
});

test('it renders feature state correctly', function (assert) {
  const feature = EmberObject.create({
    name: 'Shiny New Feature',
    description: 'Shiny new feature for Travis CI users',
    enabled: true
  });

  this.set('feature', feature);

  this.render(hbs`{{feature-toggle feature=feature}}`);

  assert.ok(this.$().find('a.switch').hasClass('active'));

  run(() => {
    feature.toggleProperty('enabled');
  });

  assert.notOk(this.$().find('a.switch').hasClass('active'));
});
