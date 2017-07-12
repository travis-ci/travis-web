import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('caches-item', 'Integration | Component | caches item', {
  integration: true
});

test('it renders', function (assert) {
  const cache = {
    repository_id: 10,
    size: 1024 * 1024,
    branch: 'master',
    last_modified: '2015-04-16T11:25:00Z',
    type: 'push'
  };
  this.cache = cache;
  this.render(hbs`{{caches-item cache=cache}}`);

  assert.ok(this.$().find('.cache-item').hasClass('push'), 'component should have a type class (push)');
  assert.equal(this.$().find('.row-item:first-child .label-align').text().trim(), 'master', 'branch name should be displayed');
  assert.equal(this.$().find('.row-item:nth-child(3) .label-align').text().trim(), '1.00MB', 'size should be displayed');
});
