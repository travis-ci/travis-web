import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insights-overlay', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('it renders when there are no builds', async function (assert) {
    this.set('interval', 'month');
    this.set('ownerData', {'@type': 'User', id: 1});
    this.set('private', true);

    await render(hbs`
      {{#insights-overlay interval=interval owner=ownerData private=private}}
        Happy pancake day!
      {{/insights-overlay}}
    `);
    await settled();

    assert.equal(this.element.textContent.trim(), 'Happy pancake day!');
  });

  test('it does not render when there are builds', async function (assert) {
    this.set('interval', 'month');
    this.set('ownerData', {'@type': 'User', id: 1});
    this.set('private', true);

    this.server.createList('insight-metric', 5);

    await render(hbs`
      {{#insights-overlay interval=interval owner=ownerData private=private}}
        Impact vs intent
      {{/insights-overlay}}
    `);
    await settled();

    assert.equal(this.element.textContent.trim(), '');
  });
});
