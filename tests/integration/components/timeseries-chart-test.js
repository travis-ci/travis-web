import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | timeseries-chart', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders TimeSeries Chart container', async function (assert) {
    await render(hbs`<TimeseriesChart />`);
    assert
      .dom('[data-test-timeseries-chart-container]')
      .exists('Timeseries Chart Container Exists');
  });

  test('it renders div to contain chart canvas', async function (assert) {
    await render(hbs`<TimeseriesChart />`);
    assert
      .dom('#time-series-container')
      .exists('Should exits div for rendering chart canvas');
  });

});
