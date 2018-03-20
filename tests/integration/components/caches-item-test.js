import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | caches item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const cache = {
      repository_id: 10,
      size: 1024 * 1024,
      branch: 'master',
      last_modified: '2015-04-16T11:25:00Z',
      type: 'push'
    };
    this.cache = cache;
    await render(hbs`{{caches-item cache=cache}}`);

    assert.ok(this.$().find('.cache-item').hasClass('push'), 'component should have a type class (push)');
    assert.equal(this.$().find('.row-item:first-child .label-align').text().trim(), 'master', 'branch name should be displayed');
    assert.equal(this.$().find('.row-item:nth-child(3) .label-align').text().trim(), '1.00MB', 'size should be displayed');
  });
});