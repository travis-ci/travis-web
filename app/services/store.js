/* eslint-disable camelcase */
import Store from 'ember-data/store';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';
import { inject as service } from '@ember/service';
import FilteredArrayManager from 'travis/utils/filtered-array-manager';
import fetchLivePaginatedCollection from 'travis/utils/fetch-live-paginated-collection';

export default Store.extend({
  auth: service(),

  defaultAdapter: 'application',
  adapter: 'application',

  init() {
    this._super(...arguments);
    this.shouldAssertMethodCallsOnDestroyedStore = true;
    this.filteredArraysManager = FilteredArrayManager.create({ store: this });
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
  filter(modelName, queryParams, filterFunction, dependencies, forceReload) {
    if (arguments.length === 0) {
      throw new Error('store.filter called with no arguments');
    }
    if (arguments.length === 1) {
      return this.peekAll(modelName);
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
    this.filteredArraysManager.destroy();
  }
});
