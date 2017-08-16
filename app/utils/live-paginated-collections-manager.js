import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';
import { computed } from 'ember-decorators/object';
import limit from 'travis/utils/computed-limit';

let LivePaginatedCollection = Ember.ArrayProxy.extend({
  // TODO: this is copied from PaginatedCollection
  @computed('paginationData')
  pagination(paginationData) {
    return {
      total: paginationData.count,
      perPage: paginationData.limit,
      offset: paginationData.offset,
      isFirst: paginationData.is_first,
      isLast: paginationData.is_last,
      prev: paginationData.prev,
      next: paginationData.next,
      first: paginationData.first,
      last: paginationData.last,
      currentPage: Ember.computed(function () {
        return (paginationData.offset / paginationData.limit + 1);
      }),
      numberOfPages: Ember.computed(function () {
        return Math.ceil(paginationData.count / paginationData.limit);
      })
    };
  },
  arrangedContent: Ember.computed.alias('limited')
});

LivePaginatedCollection.reopenClass({
  create(properties) {
    let paginationData = this.getPaginationData(properties.content.get('queryResult'));

    properties.paginationData = paginationData;
    properties.perPage = paginationData.limit;

    let instance = this._super(...arguments)

    this.defineSortByFunction(instance, properties.store, properties.modelName, properties.sort, properties.dependencies);

    return instance;
  },

  getPaginationData(queryResult) {
    return queryResult.get('meta.pagination');
  },

  defineSortByFunction(instance, store, modelName, sort = 'id:desc', dependencies) {
    let sortByFunction, sortKey, order;
    if (typeof sort === 'function') {
      sortByFunction = sort;
    } else {
      [sortKey, order] = sort.split(':');
      order = order || 'desc';
      // TODO: we need to deal with paths, like for example
      // defaultBranch.lastBuild

      if (store.modelFor(modelName).typeForRelationship(sortKey, store)) {
        // it's a relationship, so sort by id by default
        sortKey = `${sortKey}.id`;
      }

      sortByFunction = function(a, b) {
        let aValue = a.get(sortKey),
          bValue = b. get(sortKey);

        let result;
        // TODO: this should check types, not only if it's id or not
        if (sortKey.endsWith('id') || sortKey.endsWith('Id')) {
          result = parseInt(aValue) - parseInt(bValue);
        } else {
          if (aValue < bValue) {
            result = -1;
          } else if (aValue > bValue) {
            result = 1;
          } else {
            result = 0;
          }
        }

        if (order === 'desc') {
          result = -result;
        }

        return result;
      };
    }

    let sortDependencies = dependencies.slice(0); // clone

    if (sortKey && !sortDependencies.includes(sortKey)) {
      sortDependencies.push(sortKey);
    }

    sortDependencies = sortDependencies.map( (dep) => `content.@each.${dep}` );
    sortDependencies.push('content.[]');

    Ember.defineProperty(instance, 'sorted', Ember.computed(...sortDependencies, function() {
      return this.get('content').toArray().sort(sortByFunction);
    }));

    Ember.defineProperty(instance, 'limited', limit('sorted', 'pagination.perPage'));
  }
});

let LivePaginatedCollectionsManager = Ember.Object.extend({
  fetchCollection(modelName, queryParams, options) {
    let store = this.get('store'),
      dependencies = options.dependencies || [],
      filter = filter || (() => true),
      filtered = store.filter(modelName, queryParams, filter, dependencies, options.forceReload);

    return filtered.then((filteredArray) => {
      let sort = options.sort;
      return LivePaginatedCollection.create({ modelName, store, sort, dependencies, content: filteredArray });
    });
  },
});

export default LivePaginatedCollectionsManager;
