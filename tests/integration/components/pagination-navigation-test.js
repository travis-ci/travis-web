import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | pagination navigation', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.owner.lookup('router:main').startRouting(true);
    this.route = 'dashboard';
  });

  test('it renders list of pages', async function (assert) {
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
    await render(hbs`{{pagination-navigation collection=pagination route=route}}`);

    assert.dom('a.pagination-button').exists('on the first page should have one navigation button');
    assert.dom('a.pagination-button').hasText('next', 'should have a next button on the first page');
    assert.dom('.pagination-link').exists({ count: 4 }, 'should calculate with pages to display (here the first and last 2)');
    assert.dom('li:nth-of-type(2) a').hasAttribute('title', 'Go to page number 2');
    assert.dom('li:nth-of-type(3)').hasText('...', 'get ... page separator right');
  });

  // this caused duplication of pages
  test('test case then inner and outer bounds may overlap', async function (assert) {
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
    await render(hbs`{{pagination-navigation collection=pagination inner=6 outer=2 route=route}}`);
    assert.dom('.pagination-link').exists({ count: 7 }, 'should calculate with pages to display');
  });

  // this appeared after the first fix for ^ this
  test('test case when current page is in inner/outer bound intersection', async function (assert) {
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
    await render(hbs`{{pagination-navigation collection=pagination inner=6 outer=2 route=route}}`);
    assert.dom('.pagination-navigation li:nth-of-type(4) a').hasText('3', 'should display page number 3');
  });
});
