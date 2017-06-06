import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pagination-navigation', 'Integration | Component | pagination navigation', {
  integration: true
});

test('it renders list of pages', function (assert) {
  let pagination = {
    count: 34,
    limit: 5,
    offset: 0,
    is_first: true,
    is_last: false,
    prev: null,
    next: {
      offset: 5,
      limit: 5
    }
  };

  this.set('pagination', pagination);
  this.render(hbs`{{pagination-navigation pagination=pagination route="someroute"}}`);

  assert.equal(this.$().find('a.pagination-button').length, 1, 'on the first page should have one navigation button');
  assert.equal(this.$().find('a.pagination-button').text(), 'next', 'should have a next button on the first page');
  assert.equal(this.$().find('a.pagination-link').length, 7, 'should calculate correct page count');
});
