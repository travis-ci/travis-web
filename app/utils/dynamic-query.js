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

  init() {
    this._super(...arguments);
    this.setObjects([]);
    this.load();
  },

  switchToNextPage() {
    if (this.hasNextPage) {
      return this.switchToPage(this.page + 1);
    }
  },

  switchToPreviousPage() {
    if (this.hasPreviousPage) {
      return this.switchToPage(this.page - 1);
    }
  },

  switchToPage(page = 1) {
    if (page === this.page) return;
    this.set('page', page);
    return this.reload();
  },

  applyFilter(filter = '') {
    const page = 1;
    this.setProperties({ filter, page });
    return this.reload();
  },

  load() {
    return this.promise || this.reload();
  },

  reload() {
    const { page, filter } = this;
    this.promise = this.task.perform({ page, filter })
      .then((result = []) => {
        this.set('pagination', result.pagination);
        this.setObjects(result.toArray());
        return this;
      });
    return this.promise;
  }

});
