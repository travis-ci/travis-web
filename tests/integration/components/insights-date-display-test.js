import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insights-date-display', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.insightsService = this.owner.lookup('service:insights');
  });

  test('month is default', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval('month');

    await render(hbs`{{insights-date-display}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });

  test('week', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval('week');
    this.set('interval', 'week');

    await render(hbs`{{insights-date-display interval=interval}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });

  test('day', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval('day');
    this.set('interval', 'day');

    await render(hbs`{{insights-date-display interval=interval}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });
});
