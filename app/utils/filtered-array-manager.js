import Ember from 'ember';
import stringHash from 'travis/utils/string-hash';

// An array proxy wrapping records that fit a filtered array.
let FilteredArray = Ember.ArrayProxy.extend({
  arrangedContent: Ember.computed.alias('content'),

  // check if record should or shouldn't be a part of the filtered array. If the
  // record passed as an argument is not yet in the array and the filter
  // function returns a truthy value, tryRecord will push the record to the
  // array. If the record is already in the array and the filter function
  // returns falsey value, it will be removed. In other cases, it will be
  // ignored.
  tryRecord(record) {
    if (!this.get('content').includes(record) && this.fits(record)) {
      this.get('content').pushObject(record);
    } else if (this.get('content').includes(record) && !this.fits(record)) {
      this.get('content').removeObject(record);
    }
  },

  // checks if a record should be a part of an array by running filterFunction
  // with a record as an argument
  fits(record) {
    return this.get('filterFunction')(record);
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
let FilteredArrayManagerForType = Ember.Object.extend({
  init() {
    this.arrays = {};
    let store = this.get('store'),
      modelName = this.get('modelName');
    this.allRecords = store.peekAll(modelName);
    this.allRecords.addArrayObserver(this, {
      willChange: 'allRecordsWillChange',
      didChange: 'allRecordsDidChange'
    });
    this.arraysByDependency = {};
    this.dependencies = [];
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
    let id = this.calculateId(...arguments);
    let array = this.arrays[id];

    if (!array) {
      array = this.createArray(id, ...arguments);
    } else if (forceReload) {
      // if forceReload is true and array already exist, just run the query
      // to get new results
      let promise = new Ember.RSVP.Promise((resolve, reject) => {
        this.fetchQuery(queryParams).then((queryResult) => {
          array.set('queryResult', queryResult);
          resolve(array);
        }, reject);
      });

      array._lastPromise = promise;
    }

    return array;
  },

  // Creates an array for a given id and set of params.
  createArray(id, queryParams, filterFunction, dependencies) {
    // TODO: test what ahppens when records already exist in a store,I think it
    // won't work
    let array = this.arrays[id] = FilteredArray.create({ filterFunction, content: [] });

    // for each of the dependency add an array to a list of arrays by the
    // dependency. Also, create observers on all of the records if it's a new
    // dependency
    dependencies.forEach((dependency) => {
      let arrays = this.arraysByDependency[dependency];

      if (!arrays) {
        arrays = this.arraysByDependency[dependency] = [];
      }

      arrays.push(array);

      if (!this.dependencies.includes(dependency)) {
        this.dependencies.push(dependency);

        this.allRecords.forEach((record) => {
          this.addObserver(record, dependency);
        });
      }
    });

    // check existing records
    this.allRecords.forEach((record) => array.tryRecord(record));

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      // TODO: think about error handling, at the moment it will just pass the
      // reject from store.query
      this.fetchQuery(queryParams).then((queryResult) => {
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
      return this.get('store').query(this.get('modelName'), queryParams);
    } else {
      return Ember.RSVP.resolve([]);
    }
  },

  addObserver(record, property) {
    record.addObserver(property, this, 'propertyDidChange');
  },

  removeObserver(record, property) {
    record.removeObserver(property, this, 'propertyDidChange');
  },

  propertyDidChange(record, key, value, rev) {
    let arrays = this.arraysByDependency[key];

    arrays.forEach((array) => {
      array.tryRecord(record);
    });
  },

  calculateId(queryParams, filterFunction, dependencies) {
    const params = queryParams || {};
    let id = stringHash([
      Object.entries(params).map(([key, value]) => `${key}:${value}`).sort(),
      (dependencies || []).sort(),
      // not sure if this is a good idea, but I want to get the unique id for
      // each set of arguments to filter
      filterFunction.toString()
    ].toString());

    return id;
  },

  allRecordsWillChange(array, offset, removeCount, addCount) {
    this.removeRecords(array.slice(offset, offset + removeCount));
  },

  allRecordsDidChange(array, offset, removeCount, addCount) {
    this.addRecords(array.slice(offset, offset + addCount));
  },

  addRecords(records) {
    records.forEach((record) => this.addRecord(record));
  },

  removeRecords(records) {
    records.forEach((record) => this.removeRecord(record));
  },

  addRecord(record) {
    this.dependencies.forEach((dependency) => {
      this.addObserver(record, dependency);
    });

    Object.values(this.arrays).forEach((array) => {
      array.tryRecord(record);
    });
  },

  // TODO: test removing, it seems that it shouldn't work, it's an edge case
  // when it comes to travis-web, but we should probably make it work anyway,
  // just in case we need it in the future
  removeRecord(record) {
    this.dependencies.forEach((dependency) => {
      this.removeObserver(record, dependency);
    });
  }
});

let FilteredArrayManager = Ember.Object.extend({
  init() {
    this.filteredArrayManagersByType = {};
  },

  fetchArray(modelName, queryParams, filterFunction, dependencies, forceReload) {
    let [_, ...rest] = arguments;
    return this.filteredArrayManagerForType(modelName).fetchArray(...rest)._promise;
  },

  filteredArrayManagerForType(modelName) {
    let manager = this.filteredArrayManagersByType[modelName];

    if (!manager) {
      manager = this.filteredArrayManagersByType[modelName] = FilteredArrayManagerForType.create({ store: this.get('store'), modelName: modelName });
    }

    return manager;
  }
});

export default FilteredArrayManager;
