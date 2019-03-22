import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_INSIGHTS_INTERVAL, INSIGHTS_INTERVALS } from 'travis/services/insights';

module('Integration | Component | insights-date-display', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.insightsService = this.owner.lookup('service:insights');
  });

  test('display default', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval(DEFAULT_INSIGHTS_INTERVAL);

    await render(hbs`{{insights-date-display}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });

  test('display month', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval(INSIGHTS_INTERVALS.MONTH);
    this.set('interval', INSIGHTS_INTERVALS.MONTH);

    await render(hbs`{{insights-date-display interval=interval}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });

  test('display week', async function (assert) {
    let [start, end] = this.insightsService.getDatesFromInterval(INSIGHTS_INTERVALS.WEEK);
    this.set('interval', INSIGHTS_INTERVALS.WEEK);

    await render(hbs`{{insights-date-display interval=interval}}`);

    assert.equal(this.element.textContent.trim(),
      `${start.format('MMMM DD, YYYY')}\n-\n${end.format('MMMM DD, YYYY')}`
    );
  });
});
