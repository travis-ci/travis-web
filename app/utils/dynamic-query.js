import { computed } from '@ember/object';
import { reads, equal, not, notEmpty } from '@ember/object/computed';
import ArrayProxy from '@ember/array/proxy';
import Evented from '@ember/object/evented';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import bindGenerator from 'travis/utils/bind-generator';

/*
 * This utility creates a computed property that can be used on any Ember.Object instance
 * to dynamically handle pagination navigation and filtering on a remote collection.
 * The resulting property is an Ember.Array itself and can be iterated, but has some
 * additional helper properties and methods.
 *
 * Example:
 *
 * const obj = Ember.Object.extend({
 *   resources: dynamicQuery(function* ({ page = 1, filter = '' }) {
 *     yield this.store.query('resource', { page, filter });
 *   }),
 *
 *   activeResources: filterBy('resources', 'active')
 * })
 *
 * obj.resources.forEach(resource => console.log(resource));
 *
 * obj.resources.switchToNextPage();
 * obj.resources.switchToPreviousPage();
 * obj.resources.applyFilter('term');
 *
 * console.log(obj.resources.length) // 25 -> items per page
 * console.log(obj.resources.total) // 68 -> total items
 *
 * {{#unless obj.resources.isLoading }}
 *   {{#each obj.resources as |resource| }}
 *     {{resource.name}}
 *   {{/each}}
 * {{/unless}}
 *
 * {{#if obj.resources.hasNextPage }}
 *   <button onclick={{action obj.resources.switchToNextPage }}>
 *     Go To Next Page
 *   </button>
 * {{/if}}
 */
export default function dynamicQuery(...args) {
  const taskFn = args.pop();

  assert('Task must be provided', typeof taskFn === 'function');
  assert('Task must be a GeneratorFunction', taskFn.constructor.name === 'GeneratorFunction');

  args.push(function () {
    const taskFnBound = bindGenerator(taskFn, this);
    return DynamicQuery.extend({ task: task(taskFnBound).keepLatest() }).create({ content: [] });
  });

  return computed(...args);
}

export const EVENTS = {
  PAGE_CHANGED: 'page-changed',
  FILTER_CHANGED: 'filter-changed'
};

const DynamicQuery = ArrayProxy.extend(Evented, {
  task: null,
  promise: null,

  page: 1,
  filterTerm: '',

  pagination: null,

  isLoading: reads('task.isRunning'),
  isNotLoading: not('isLoading'),

  isFiltering: notEmpty('filterTerm'),
  isNotFiltering: not('isFiltering'),

  isEmpty: equal('total', 0),
  isNotEmpty: not('isEmpty'),

  hasNextPage: not('pagination.isLast'),
  hasPreviousPage: not('pagination.isFirst'),

  total: reads('pagination.total'),

  init() {
    this._super(...arguments);
    this.setObjects([]);
    this.load();
  },

  switchToNextPage() {
    const { hasNextPage, page, promise } = this;
    return hasNextPage ? this.switchToPage(page + 1) : promise;
  },

  switchToPreviousPage() {
    const { hasPreviousPage, page, promise } = this;
    return hasPreviousPage ? this.switchToPage(page - 1) : promise;
  },

  switchToPage(page = 1) {
    const { page: currentPage, promise } = this;
    return page === currentPage ? promise : this.reload({ page });
  },

  applyFilter(filterTerm = '') {
    const page = 1;
    return this.reload({ filterTerm, page });
  },

  load(options) {
    return this.promise || this.reload(options);
  },

  reload(options) {
    this.applyOptions(options);

    const { page, filterTerm } = this;

    this.promise = this.task.perform({ page, filter: filterTerm })
      .then((result = []) => {
        this.set('pagination', result.pagination);
        this.setObjects(result.toArray());
        return this;
      });

    return this.promise;
  },

  applyOptions({ page, filterTerm } = {}) {
    if (page !== undefined && page !== this.currentPage) {
      this.set('page', page);
      this.trigger(EVENTS.PAGE_CHANGED, page);
    }

    if (filterTerm !== undefined && filterTerm !== this.filterTerm) {
      this.set('filterTerm', filterTerm);
      this.trigger(EVENTS.FILTER_CHANGED, filterTerm);
    }
  }

});
