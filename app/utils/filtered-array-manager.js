import Ember from 'ember';

// generate hash for a string
// found here:
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
let stringHash = function (string) {
  let hash = 0;
  if (string.length == 0) return hash;
  let i = 0;
  for (; i < string.length; i++) {
      let c = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+c;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

let FilteredArray = Ember.ArrayProxy.extend({
  arrangedContent: Ember.computed.alias('content'),
  tryRecord(record) {
    if (!this.get('content').includes(record) && this.fits(record)) {
      this.get('content').pushObject(record);
    } else if (this.get('content').includes(record) && !this.fits(record)) {
      this.get('content').removeObject(record);
    }
  },

  fits(record) {
    return this.get('filterFunction')(record);
  }
});

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

  fetchArray(queryParams, filterFunction, dependencies) {
    let id = this.calculateId(...arguments);
    let array = this.arrays[id];

    if (!array) {
      array = this.arrays[id] = this.createArray(id, ...arguments);
    }
    return array;
  },

  createArray(id, queryParams, filterFunction, dependencies) {
    let array = this.arrays[id] = FilteredArray.create({ filterFunction, content: [] });
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

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      // TODO: think about error handling, at the moment it will just pass the
      // reject from store.query
      this.get('store').query(this.get('modelName'), queryParams).then((queryResult) => {
        array.set('queryResult', queryResult);
        resolve(array);
      }, reject)
    });

    array._promise = promise;

    return array;
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
    let id = stringHash([
      Object.entries(queryParams).map( ([key, value]) => `${key}:${value}` ).sort(),
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

  fetchArray(modelName, queryParams, filterFunction, dependencies) {
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
