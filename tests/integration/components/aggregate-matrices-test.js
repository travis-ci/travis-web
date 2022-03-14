import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';


module('Integration | Component | aggregate-matrices', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders aggregate-matrices container', async function (assert) {
    await render(hbs`<AggregateMatrices />`);
    assert
      .dom('[data-test-aggregate-matrices-container]')
      .exists('Aggregate Matrices Container Exists');
  });

  test('build details', async function (assert) {
    await render(hbs`<AggregateMatrices />`);
    assert
      .dom('[data-test-builds]')
      .exists('Aggregate Matrices Build Exists');
    assert.dom('[data-test-builds-label]').hasText('Builds');
    assert.dom('[data-test-builds-count]').exists('Build count present');
    assert.dom('[data-test-builds-percent]').exists('Build percentage exits');
  });

  test('minute details ', async function (assert) {
    await render(hbs`<AggregateMatrices />`);
    assert
      .dom('[data-test-minutes]')
      .exists('Aggregate Matrices minute Exists');
    assert.dom('[data-test-minutes-label]').hasText('Minutes');
    assert.dom('[data-test-minutes-count]').exists('minute count present');
    assert.dom('[data-test-minutes-percent]').exists('minute percentage exits');
  });

  test('credit details', async function (assert) {
    await render(hbs`<AggregateMatrices />`);
    assert
      .dom('[data-test-credits]')
      .exists('Aggregate Matrices credit Exists');
    assert.dom('[data-test-credits-label]').hasText('Credits');
    assert.dom('[data-test-credits-count]').exists('credit count present');
    assert.dom('[data-test-credits-percent]').exists('credit percentage exits');
  });

});
