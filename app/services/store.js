/* eslint-disable camelcase */
import Store, { CacheHandler } from 'ember-data/store';
import RequestManager from '@ember-data/request';
import {LegacyNetworkHandler} from '@ember-data/legacy-compat';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';
import { inject as service } from '@ember/service';
import FilteredArrayManager from 'travis/utils/filtered-array-manager';
import fetchLivePaginatedCollection from 'travis/utils/fetch-live-paginated-collection';

export default Store.extend({
  auth: service(),

  defaultAdapter: 'application',
  adapter: 'application',
  subscriptions: [],

  init() {
    this._super(...arguments);
    this.shouldAssertMethodCallsOnDestroyedStore = true;
    this.filteredArraysManager = FilteredArrayManager.create({ store: this });
    this.requestManager = new RequestManager();
    this.requestManager.use([LegacyNetworkHandler]);
    this.requestManager.useCache(CacheHandler);
  },

  // Fetch a filtered collection.
  //
  // modelName      - a type of the model passed as a string, for example 'repo'
  // queryParams    - params that will be passed to the store.query function when
  //                  fetching records on the initial call. Passing null or
  //                  undefined here will stop any requests from happening,
  //                  filtering will be based only on existing records
  // filterFunction - a function that will be called to determine wheather a
  //                  record should be included in the filtered collection. A
  //                  passed function will be called with a record as an
  //                  argument
  // dependencies   - a list of dependencies that will trigger the re-evaluation
  //                  of a record. When one of the dependencies changes on any
  //                  of the records in the store, it may be added or removed
  //                  from a filtered array.
  // forceReload    - if set to true, store.query will be run on each call
  //                  instead of only running it on the first run
  //
  // Example:
  //
  //   store.filter(
  //     'repo',
  //     { starred: true },
  //     (repo) => repo.get('starred'),
  //     ['starred'],
  //     true
  //   )
  //
  // Rationale for our own implementation of store.filter:
  //
  // The default implementation of filter is rather limited and misses a few
  // scenarios important to us. The problem is that when you use the default
  // store.filter implementation, it evaluates if a record should be added to a
  // filtered array only when a new record is added to the store or when a
  // property on a record itself changes. That means that we can't observe
  // computed properties that depend on anything else than defined properties.
  // Our implementation allows to pass dependencies as an optional argument,
  // which allows to pass any property as a dependency.
  //
  // One more change in relation to the default filter representation is that
  // the default store.filter implementation will always fetch new records. The
  // new implementation has an identity map built in and it will always fetch
  // the same array for the same set of arguments. Thanks to that running
  // store.filter multiple times will return immediately on the second and
  // subsequent tries.
  //
  // If you need to also fetch new results each time the function is run, you
  // can set forceReload option to true, but it will still resolve immediately
  // once a first query is already finished.
  //
  // For more info you may also see comments in FilteredArraysManager.
  filter(modelName, queryParams, filterFunction = undefined, dependencies = undefined, forceReload = false) {
    if (this.filteredArraysManager === undefined) {
      this.filteredArraysManager = FilteredArrayManager.create({ store: this });
    }
    if (arguments.length === 0) {
      throw new Error('store.filter called with no arguments');
    }
    if (arguments.length === 1) {
      return this.findAll(modelName);
    }
    if (arguments.length === 2) {
      filterFunction = queryParams;
      return this.filteredArraysManager.filter(modelName, null, filterFunction, ['']);
    }

    if (!dependencies) {
      return this.filteredArraysManager.filter(modelName, queryParams, filterFunction, ['']);
    } else {
      return this.filteredArraysManager.fetchArray(modelName, queryParams, filterFunction, dependencies, forceReload);
    }
  },


  subscribe(obj, caller, modelName, queryParams, filterFunction, dependencies, forceReload, beforeCb, afterCb) {
    let sub = {
      object: obj,
      caller: caller,
      model: modelName,
      query: queryParams,
      filter: filterFunction,
      dependencies: dependencies,
      forceReload: forceReload,
      beforeCb: beforeCb,
      afterCb: afterCb
    };
    this.subscriptions.push(sub);
  },

  unsubscribe(obj) {
    this.subscriptions = this.subscriptions.filter((sub) => { sub.object !== obj; });
  },


  // Returns a collection with pagination data. If the first page is requested,
  // the collection will be live updated. Otherwise keeping the calculations and
  // figuring out if the record should be put on the page is not easily
  // achieveable (or even impossible in some cases).
  //
  // modelName   - a type of the model as a string, for example 'repo'
  // queryParams - params for a store.query call that will be fired to fetch the
  //               data from the server
  // options     - additional options:
  //               filter      - a filter function that will be used to test if a
  //                             record should be added or removed from the array. It
  //                             will be called with a record under test as an
  //                             argument. It only matters for live updates
  //               sort        - either a string or a function to sort the collection
  //                             with. If it's a string, it should be the name of the
  //                             property to sort by, with an optional ':asc' or
  //                             ':desc' suffixes, for example 'id:desc'. If it's a
  //                             function it will be called with 2 records to compare
  //                             as an argument
  //               dependencies - a set of dependencies that will be watched to
  //                              re-evaluate if a record should be a part of a
  //                              collection
  //               forceReload  - if set to true, store.query will be run on
  //                              call
  //
  // Examples:
  //
  //   store.paginated(
  //     'repo',
  //     { active: true, offset: 0, limit: 10 },
  //     {
  //       filter: (repo) => repo.get('active'),
  //       sort: 'id:desc',
  //       dependencies: ['active'],
  //       forceReload: true
  //     }
  //
  paginated(modelName, queryParams, options = {}) {
    let allowLive = !options.hasOwnProperty('live') || options.live;
    if (!parseInt(queryParams.offset) && allowLive) {
      // we're on the first page, live updates can be enabled
      return fetchLivePaginatedCollection(this, ...arguments);
    } else {
      return PaginatedCollectionPromise.create({
        content: this.query(...arguments)
      });
    }
  },

  xcreateRecord(type, ...params) {
    let res =  this._super(...arguments);
    return res;
  },

  smartQueryRecord(type, ...params) {
    let res =  this.queryRecord(type, ...params);
    return res;
  },

  push(object) {
    const id = object.data.id;
    const type = object.data.type;

    if (this.shouldAdd(object)) {
      const included = object.included ? JSON.parse(JSON.stringify(object.included)) : null;
      if (included) {
        object.included = included.filter(single => this.shouldAdd({data: single}));
      }

      this.subscriptions.forEach(sub => {
        if (sub.modelType == type && sub.beforeCb) {
          sub.beforeCb(sub.object, sub.caller);
        }
      });
      let res =  this._super(...arguments);

      this.subscriptions.forEach(sub => {
        if (sub.modelType == type && sub.afterCb) {
          sub.afterCb(sub.object, sub.caller);
        }
      });

      return res;
    } else {
      return this.peekRecord(type, id);
    }
  },

  shouldAdd(object) {
    const data = object.data;
    const type = data.type;
    const newUpdatedAt = data.attributes ? data.attributes.updatedAt : null;
    const id = data.id;
    if (newUpdatedAt) {
      const record = this.peekRecord(type, id);
      if (record) {
        const existingUpdatedAt = record.get('updatedAt');
        return !existingUpdatedAt || existingUpdatedAt <= newUpdatedAt;
      } else {
        return true;
      }
    } else {
      return true;
    }
  },

  // We shouldn't override private methods, but at the moment I don't see any
  // other way to prevent updating records with outdated data.
  // _pushInternalModel seems to be the entry point for all of the data loading
  // related functions, so it's the best place to override to check the
  // updated_at field
  _pushInternalModel(data) {
    let type = data.type;
    let newUpdatedAt = data.attributes ? data.attributes.updatedAt : null;

    if (newUpdatedAt) {
      let internalModel = this._internalModelForId(type, data.id),
        record = internalModel.getRecord(),
        existingUpdatedAt = record.get('updatedAt');

      if (!existingUpdatedAt || existingUpdatedAt <= newUpdatedAt) {
        return this._super(...arguments);
      } else {
        // record to push is older than the existing one, we need to skip,
        // but we still need to return the result
        return internalModel;
      }
    } else {
      return this._super(...arguments);
    }
  },

  destroy() {
    this._super(...arguments);
    if (this.filteredArraysManager) {
      this.filteredArraysManager.destroy();
    }
  }
});
