import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  DEFAULT_INSIGHTS_INTERVAL,
  INSIGHTS_INTERVALS
} from 'travis/services/insights';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | insights-overlay', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const user = this.server.create('user');
    this.setProperties({
      ownerData: user,
      private: true
    });
  });

  test('month version renders correctly', async function (assert) {
    this.set('interval', INSIGHTS_INTERVALS.MONTH);

    await render(hbs`{{insights-overlay interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('[data-test-insights-overlay-title]').hasText('Build to get monthly insights');
    assert.dom('[data-test-insights-overlay-text]').hasText('All the build status results from the last 30 days will appear here. Have you tried logging in?');
    assert.dom('[data-test-insights-overlay-link]').hasText('Sign in');
    assert.dom('.overlay-backdrop').hasClass('overlay-backdrop--visible');
  });

  test('week version renders correctly', async function (assert) {
    this.set('interval', INSIGHTS_INTERVALS.WEEK);

    await render(hbs`{{insights-overlay interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('[data-test-insights-overlay-title]').hasText('It\'s been a quiet week for builds');
    assert.dom('[data-test-insights-overlay-text]').hasText('All the build status results from the last 7 days will appear here. Have you tried logging in?');
    assert.dom('[data-test-insights-overlay-link]').hasText('Sign in');
    assert.dom('.overlay-backdrop').hasClass('overlay-backdrop--visible');
  });

  test('it does not show when there are builds', async function (assert) {
    this.set('interval', DEFAULT_INSIGHTS_INTERVAL);

    this.server.createList('insight-metric', 5);

    await render(hbs`{{insights-overlay interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.overlay-backdrop').hasNoClass('overlay-backdrop--visible');
  });
});
