import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | feature toggle', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders feature state correctly', async function(assert) {
    const feature = EmberObject.create({
      name: 'Shiny New Feature',
      description: 'Shiny new feature for Travis CI users',
      enabled: true
    });

    this.set('feature', feature);

    await render(hbs`{{feature-toggle feature=feature}}`);

    assert.ok(this.$().find('a.switch').hasClass('active'));

    run(() => {
      feature.toggleProperty('enabled');
    });

    assert.notOk(this.$().find('a.switch').hasClass('active'));
  });
});