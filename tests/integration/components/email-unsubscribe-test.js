import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | email-unsubscribe', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const repo = server.create('repository');
    this.set('router', EmberObject.create({
      currentURL: `http://travis-ci.org/unsubscribe?repository=${repo.id}`
    }));
  });

  test('it renders', async function (assert) {
    await render(hbs`tmp`);

    assert.ok(true);
  });
});
