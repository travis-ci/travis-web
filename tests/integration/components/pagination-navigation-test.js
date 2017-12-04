import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pagination-navigation', 'Integration | Component | pagination navigation', {
  integration: true
});

test('it renders list of pages', function (assert) {
  let pageData = {
    pagination: {
      total: 97,
      perPage: 5,
      offset: 0,
      isFirst: true,
      isLast: false,
      prev: null,
      next: {
        offset: 5,
        limit: 5
      },
      currentPage: 1,
      numberOfPages: 20
    }
  };

  this.set('pagination', pageData);
  this.render(hbs`{{pagination-navigation collection=pagination route="someroute"}}`);

  assert.equal(this.$().find('a.pagination-button').length, 1, 'on the first page should have one navigation button');
  assert.equal(this.$().find('a.pagination-button').text(), 'next', 'should have a next button on the first page');
  assert.equal(this.$().find('.pagination-link').length, 4, 'should calculate with pages to display (here the first and last 2)');
  assert.equal(this.$().find('li:nth-of-type(3)').text().trim(), '...', 'get ... page separator right');
});

// this caused duplication of pages
test('test case then inner and outer bounds may overlap', function (assert) {
  let pageData = {
    pagination: {
      total: 397,
      perPage: 5,
      offset: 0,
      isFirst: true,
      isLast: false,
      prev: null,
      next: {
        offset: 5,
        limit: 5
      },
      currentPage: 1,
      numberOfPages: 80
    }
  };

  this.set('pagination', pageData);
  this.render(hbs`{{pagination-navigation collection=pagination inner=6 outer=2 route="someroute"}}`);
  assert.equal(this.$().find('.pagination-link').length, 7, 'should calculate with pages to display');
});

// this appeared after the first fix for ^ this
test('test case when current page is in inner/outer bound intersection', function (assert) {
  let pageData = {
    pagination: {
      total: 397,
      perPage: 5,
      offset: 10,
      isFirst: false,
      isLast: false,
      prev: null,
      next: {
        offset: 15,
        limit: 5
      },
      currentPage: 3,
      numberOfPages: 80
    }
  };

  this.set('pagination', pageData);
  this.render(hbs`{{pagination-navigation collection=pagination inner=6 outer=2 route="someroute"}}`);
  assert.equal(this.$().find('.pagination-navigation li:nth-of-type(4) a').text(), '3', 'should display page number 3');
});
