import { Promise as EmberPromise, resolve } from 'rsvp';
import EmberObject, { computed, defineProperty } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import stringHash from 'travis/utils/string-hash';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

const PromiseArray = ArrayProxy.extend(PromiseProxyMixin);

// An array proxy wrapping records that fit a filtered array.
let FilteredArray = ArrayProxy.extend({
  init(createArgs) {
    const { filterFunction, _all, dependencies } = createArgs;
    defineProperty(
      this,
      'content',
      computed(
        `_all.@each.{${dependencies.join(',')}}`,
        () => _all.filter(item => item && filterFunction(item))
      )
    );

    this._super(createArgs);
  }
});

// Manages filtered arrays for a given type. It keeps a reference to all of the
// records of a given type (obtained using store.peekAll() function) and watches
// for changes on all of the records to determine wheather a record should be
// added to one of the filtered arrays.
//
// Filtered arrays are indexed by an id unique for a given set of parameters,
// calculated using the calculateId function.
//
// In order to minimise the number of observers FilteredArrayManagerForType will
// group arrays by dependencies. Let's consider the following code:
//
//     let manager = FilteredArrayManagerForType.create({ modelName: 'repo' });
//
//     manager.fetchArray({}, function() {}, ['id']) {
//     manager.fetchArray({}, function() {}, ['id', 'slug']) {
//
// 2 arrays will be created for such a call for dependencies ['id'] and
// ['id', 'slug'] respectively. That means that all of the records need to be
// observed for dependencies 'id' and 'slug'. Instead of creating 2 observers
// for the 'id' dependency we will create only one observer, which will process
// both arrays.
//
// Whenever a record is added to a store for a given type,
// FilteredArrayManagerForType will add observers for the record and it will see
// if the record needs to be added to any of the filtered arrays. Whenever a
// record is removed, the observers will be removed as well and it will be
// removed from all of the filtered arrays.
let FilteredArrayManagerForType = EmberObject.extend({
  init() {
    this._super(...arguments);
    this.arrays = {};
    this.allRecords = this.store.peekAll(this.modelName);
  },

  // Fetches a filtered array. If an array for a given set of dependencies
  // doesn't exist, it will be created. A query will be run for a newly created
  // array and each time the forceReload option is set to true
  //
  // queryParams    - params that will be passed to the store.query function when
  //                  fetching records on the initial call
  // filterFunction - a function that will be used to test if a record should be
  //                  added or removed from an array. It will be called with a
  //                  record under test as a sole argument
  // dependencies   - a set of dependencies that will be watched to re-evaluate
  //                  if a record should be a part of a filtered array
  // forceReload    - if set to true, store.query will be run on each call
  //
  // Examples:
  //
  //   manager.fetchArray(
  //     { starred: true },
  //     (repo) => repo.get('starred'),
  //     ['starred'],
  //     true
  //   )
  //
  // Returns a FilteredArray (an ArrayProxy)
  fetchArray(queryParams, filterFunction, dependencies, forceReload) {
    let id = this.calculateId(queryParams, filterFunction, dependencies);
    let hasArray = !!this.arrays[id];
    let array = this._getFilterArray(id, queryParams, filterFunction, dependencies);

    if (hasArray && forceReload) {
      // if forceReload is true and array already exist, just run the query
      // to get new results
      let promise = new EmberPromise((resolve, reject) => {
        this.fetchQuery(queryParams).then(queryResult => {
          array.set('queryResult', queryResult);
          resolve(array);
        }, reject);
      });

      array._lastPromise = promise;
    }

    return array;
  },

  _getFilterArray(id, queryParams, filterFunction, dependencies) {
    let array = this.arrays[id];

    if (!array) {
      array = this.createArray(id, queryParams, filterFunction, dependencies);
    }

    return array;
  },

  getFilterArray(queryParams, filterFunction, dependencies) {
    let id = this.calculateId(queryParams, filterFunction, dependencies);
    return this._getFilterArray(id, queryParams, filterFunction, dependencies);
  },

  // Creates an array for a given id and set of params.
  createArray(id, queryParams, filterFunction, dependencies) {
    // TODO: test what ahppens when records already exist in a store,I think it
    // won't work
    let array = (this.arrays[id] = FilteredArray.create({
      filterFunction,
      _all: this.allRecords,
      dependencies
    }));

    let promise = new EmberPromise((resolve, reject) => {
      // TODO: think about error handling, at the moment it will just pass the
      // reject from store.query
      this.fetchQuery(queryParams).then(queryResult => {
        array.set('queryResult', queryResult);
        resolve(array);
      }, reject);
    });

    array._promise = promise;
    array._lastPromise = promise;

    return array;
  },

  // Runs a store.query() function for a type that the array is handling with
  // queryParams passed as an argument.
  fetchQuery(queryParams) {
    if (queryParams) {
      return this.store.query(this.modelName, queryParams);
    } else {
      return resolve([]);
    }
  },

  calculateId(queryParams, filterFunction, dependencies) {
    const params = queryParams || {};
    let id = stringHash(
      [
        JSON.stringify(params),
        (dependencies || []).sort(),
        // not sure if this is a good idea, but I want to get the unique id for
        // each set of arguments to filter
        filterFunction.toString()
      ].toString()
    );

    return id;
  },

  destroy() {
    this._super(...arguments);
    Object.keys(this.arrays).forEach(key => {
      this.arrays[key].destroy();
    });
  }
});

let FilteredArrayManager = EmberObject.extend({
  init() {
    this.filteredArrayManagersByType = {};
  },

  filter(modelName, queryParams, filterFunction, dependencies) {
    const filterArray = this.filteredArrayManagerForType(modelName).getFilterArray(queryParams, filterFunction, dependencies);

    if (queryParams) {
      let currentRecords = this.store.peekAll(modelName);
      if (filterFunction) {
        currentRecords = currentRecords.filter(record => filterFunction(record));
      }
      const promise = resolve(currentRecords).then(() => filterArray);

      return PromiseArray.create({ promise });
    }

    return filterArray;
  },

  fetchArray(modelName, ...rest) {
    return this.filteredArrayManagerForType(modelName).fetchArray(...rest)
      ._promise;
  },

  filteredArrayManagerForType(modelName) {
    let manager = this.filteredArrayManagersByType[modelName];

    if (!manager) {
      manager = this.filteredArrayManagersByType[
        modelName
      ] = FilteredArrayManagerForType.create({
        store: this.store,
        modelName: modelName
      });
    }

    return manager;
  },

  destroy() {
    this._super(...arguments);
    Object.keys(this.filteredArrayManagersByType).forEach(key => {
      this.filteredArrayManagersByType[key].destroy();
    });
    this.filteredArrayManagersByType = {};
  }
});

export default FilteredArrayManager;
