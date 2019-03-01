import { computed } from '@ember/object';
import { reads, equal, not } from '@ember/object/computed';
import ArrayProxy from '@ember/array/proxy';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import bindGenerator from 'travis/utils/bind-generator';

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

const DynamicQuery = ArrayProxy.extend({
  task: null,
  promise: null,

  page: 1,
  filter: '',

  pagination: null,

  isLoading: reads('task.isRunning'),
  isEmpty: equal('length', 0),

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

  applyFilter(filter = '') {
    const page = 1;
    return this.reload({ filter, page });
  },

  load(options) {
    return this.promise || this.reload(options);
  },

  reload(options) {
    this.applyOptions(options);

    const { page, filter } = this;

    this.promise = this.task.perform({ page, filter })
      .then((result = []) => {
        this.set('pagination', result.pagination);
        this.setObjects(result.toArray());
        return this;
      });

    return this.promise;
  },

  applyOptions({ page, filter } = {}) {
    if (page !== undefined)
      this.set('page', page);

    if (filter !== undefined)
      this.set('filter', filter);
  }

});
