(function() {

Ember.Adapter = Ember.Object.extend({
  find: function(record, id) {
    throw new Error('Ember.Adapter subclasses must implement find');
  },

  findQuery: function(klass, records, params) {
    throw new Error('Ember.Adapter subclasses must implement findQuery');
  },

  findMany: function(klass, records, ids) {
    throw new Error('Ember.Adapter subclasses must implement findMany');
  },

  findAll: function(klass, records) {
    throw new Error('Ember.Adapter subclasses must implement findAll');
  },

  load: function(record, id, data) {
    record.load(id, data);
  },

  createRecord: function(record) {
    throw new Error('Ember.Adapter subclasses must implement createRecord');
  },

  saveRecord: function(record) {
    throw new Error('Ember.Adapter subclasses must implement saveRecord');
  },

  deleteRecord: function(record) {
    throw new Error('Ember.Adapter subclasses must implement deleteRecord');
  }
});

})();

(function() {

var get = Ember.get;

Ember.FixtureAdapter = Ember.Adapter.extend({
  _findData: function(klass, id) {
    var fixtures = klass.FIXTURES,
        primaryKey = get(klass, 'primaryKey'),
        data = Ember.A(fixtures).find(function(el) { return el[primaryKey] === id; });

    return data;
  },

  find: function(record, id) {
    var data = this._findData(record.constructor, id);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        Ember.run(record, record.load, id, data);
        resolve(record);
      });
    });
  },

  findMany: function(klass, records, ids) {
    var fixtures = klass.FIXTURES,
        requestedData = [];

    for (var i = 0, l = ids.length; i < l; i++) {
      requestedData.push(this._findData(klass, ids[i]));
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        Ember.run(records, records.load, klass, requestedData);
        resolve(records);
      });
    });
  },

  findAll: function(klass, records) {
    var fixtures = klass.FIXTURES;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        Ember.run(records, records.load, klass, fixtures);
        resolve(records);
      });
    });
  },

  createRecord: function(record) {
    var klass = record.constructor,
        fixtures = klass.FIXTURES;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        fixtures.push(klass.findFromCacheOrLoad(record.toJSON()));
        record.didCreateRecord();
        resolve(record);
      });
    });
  },

  saveRecord: function(record) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        record.didSaveRecord();
        resolve(record);
      });
    });
  },

  deleteRecord: function(record) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      setTimeout(function() {
        record.didDeleteRecord();
        resolve(record);
      });
    });
  }
});


})();

(function() {

var get = Ember.get,
    set = Ember.set;

Ember.RecordArray = Ember.ArrayProxy.extend(Ember.Evented, {
  isLoaded: false,
  isLoading: Ember.computed.not('isLoaded'),

  load: function(klass, data) {
    set(this, 'content', this.materializeData(klass, data));
    this.notifyLoaded();
  },

  loadForFindMany: function(klass) {
    var content = get(this, '_ids').map(function(id) { return klass.cachedRecordForId(id); });
    set(this, 'content', Ember.A(content));
    this.notifyLoaded();
  },

  notifyLoaded: function() {
    set(this, 'isLoaded', true);
    this.trigger('didLoad');
  },

  materializeData: function(klass, data) {
    return Ember.A(data.map(function(el) {
      return klass.findFromCacheOrLoad(el); // FIXME
    }));
  }
});


})();

(function() {

var get = Ember.get;

Ember.FilteredRecordArray = Ember.RecordArray.extend({
  init: function() {
    if (!get(this, 'modelClass')) {
      throw new Error('FilteredRecordArrays must be created with a modelClass');
    }
    if (!get(this, 'filterFunction')) {
      throw new Error('FilteredRecordArrays must be created with a filterFunction');
    }
    if (!get(this, 'filterProperties')) {
      throw new Error('FilteredRecordArrays must be created with filterProperties');
    }

    var modelClass = get(this, 'modelClass');
    modelClass.registerRecordArray(this);

    this.registerObservers();
    this.updateFilter();
  },

  updateFilter: function() {
    var self = this,
        results = [];
    get(this, 'modelClass').forEachCachedRecord(function(record) {
      if (self.filterFunction(record)) {
        results.push(record);
      }
    });
    this.set('content', Ember.A(results));
  },

  updateFilterForRecord: function(record) {
    var results = get(this, 'content');
    if (this.filterFunction(record)) {
      results.pushObject(record);
    }
  },

  registerObservers: function() {
    var self = this;
    get(this, 'modelClass').forEachCachedRecord(function(record) {
      self.registerObserversOnRecord(record);
    });
  },

  registerObserversOnRecord: function(record) {
    var self = this,
        filterProperties = get(this, 'filterProperties');

    for (var i = 0, l = get(filterProperties, 'length'); i < l; i++) {
      record.addObserver(filterProperties[i], self, 'updateFilterForRecord');
    }
  }
});

})();

(function() {

var get = Ember.get;

Ember.ManyArray = Ember.RecordArray.extend({
  _records: null,

  objectAtContent: function(idx) {
    var content = get(this, 'content');

    if (!content.length) { return; }

    // TODO: Create a LazilyMaterializedRecordArray class and test it
    if (this._records && this._records[idx]) { return this._records[idx]; }

    var record = this.materializeRecord(idx);

    if (!this._records) { this._records = {}; }
    this._records[idx] = record;

    return record;
  },

  save: function() {
    // TODO: loop over dirty records only
    return Ember.RSVP.all(this.map(function(record) {
      return record.save();
    }));
  },

  replaceContent: function(index, removed, added) {
    added = Ember.EnumerableUtils.map(added, function(record) {
      return record._reference;
    }, this);

    this._super(index, removed, added);
  }
});

Ember.HasManyArray = Ember.ManyArray.extend({
  materializeRecord: function(idx) {
    var klass = get(this, 'modelClass'),
        content = get(this, 'content'),
        reference = content.objectAt(idx),
        record;

    if (reference.record) {
      record = reference.record;
    } else {
      record = klass.findById(reference.id);
    }

    return record;
  },

  toJSON: function() {
    var ids = [], content = this.get('content');

    content.forEach(function(reference) {
      if (reference.id) {
        ids.push(reference.id);
      }
    });

    return ids;
  }
});

Ember.EmbeddedHasManyArray = Ember.ManyArray.extend({
  create: function(attrs) {
    var klass = get(this, 'modelClass'),
        record = klass.create(attrs);

    this.pushObject(record);

    return record; // FIXME: inject parent's id
  },

  materializeRecord: function(idx) {
    var klass = get(this, 'modelClass'),
        primaryKey = get(klass, 'primaryKey'),
        content = get(this, 'content'),
        reference = content.objectAt(idx),
        attrs = reference.data;

    if (reference.record) {
      return reference.record;
    } else {
      var record = klass.create({ _reference: reference });
      if(attrs) {
        record.load(attrs[primaryKey], attrs);
      }
      return record;
    }
  },

  toJSON: function() {
    return this.map(function(record) {
      return record.toJSON();
    });
  }
});


})();

(function() {

var get = Ember.get,
    set = Ember.set,
    setProperties = Ember.setProperties,
    meta = Ember.meta,
    underscore = Ember.String.underscore;

function contains(array, element) {
  for (var i = 0, l = array.length; i < l; i++) {
    if (array[i] === element) { return true; }
  }
  return false;
}

function concatUnique(toArray, fromArray) {
  var e;
  for (var i = 0, l = fromArray.length; i < l; i++) {
    e = fromArray[i];
    if (!contains(toArray, e)) { toArray.push(e); }
  }
  return toArray;
}

function hasCachedValue(object, key) {
  var objectMeta = meta(object, false);
  if (objectMeta) {
    return key in objectMeta.cache;
  }
}

Ember.run.queues.push('data');

Ember.Model = Ember.Object.extend(Ember.Evented, {
  isLoaded: true,
  isLoading: Ember.computed.not('isLoaded'),
  isNew: true,
  isDeleted: false,
  _dirtyAttributes: null,

  /**
    Called when attribute is accessed.

    @method getAttr
    @param key {String} key which is being accessed
    @param value {Object} value, which will be returned from getter by default
  */
  getAttr: function(key, value) {
    return value;
  },

  isDirty: Ember.computed(function() {
    var attributes = this.attributes,
        dirtyAttributes = Ember.A(), // just for removeObject
        key, cachedValue, dataValue, desc, descMeta, type, isDirty;

    for (var i = 0, l = attributes.length; i < l; i++) {
      key = attributes[i];
      if (!hasCachedValue(this, key)) { continue; }
      cachedValue = this.cacheFor(key);
      dataValue = get(this, 'data.'+this.dataKey(key));
      desc = meta(this).descs[key];
      descMeta = desc && desc.meta();
      type = descMeta.type;

      if (type && type.isEqual) {
        isDirty = !type.isEqual(dataValue, cachedValue);
      } else if (dataValue !== cachedValue) {
        isDirty = true;
      } else {
        isDirty = false;
      }

      if (isDirty) {
        dirtyAttributes.push(key);
      }
    }

    if (dirtyAttributes.length) {
      this._dirtyAttributes = dirtyAttributes;
      return true;
    } else {
      this._dirtyAttributes = [];
      return false;
    }
  }).property().volatile(),

  dataKey: function(key) {
    var camelizeKeys = get(this.constructor, 'camelizeKeys');
    return camelizeKeys ? underscore(key) : key;
  },

  init: function() {
    this._createReference();
    this._super();
  },

  _createReference: function() {
    var reference = this._reference,
        id = this.getPrimaryKey();

    if (!reference) {
      reference = this.constructor._referenceForId(id);
      reference.record = this;
      this._reference = reference;
    }

    if (!reference.id) {
      reference.id = id;
    }

    return reference;
  },

  getPrimaryKey: function() {
    return get(this, get(this.constructor, 'primaryKey'));
  },

  load: function(id, hash) {
    var data = {};
    data[get(this.constructor, 'primaryKey')] = id;
    set(this, 'data', Ember.merge(data, hash));
    set(this, 'isLoaded', true);
    set(this, 'isNew', false);
    this._createReference();
    this.trigger('didLoad');
  },

  didDefineProperty: function(proto, key, value) {
    if (value instanceof Ember.Descriptor) {
      var meta = value.meta();

      if (meta.isAttribute) {
        if (!proto.attributes) { proto.attributes = []; }
        proto.attributes.push(key);
      } else if (meta.isRelationship) {
        if (!proto.relationships) { proto.relationships = []; }
        proto.relationships.push(key);
      }
    }
  },

  serializeHasMany: function(key, meta) {
    return this.get(key).toJSON();
  },

  serializeBelongsTo: function(key, meta) {
    if (meta.options.embedded) {
      var record = this.get(key);
      if (record) {
        return record.toJSON();
      }
    } else {
      var primaryKey = get(meta.type, 'primaryKey');
      return this.get(key + '.' + primaryKey);
    }
  },

  toJSON: function() {
    var key, meta,
        properties = this.getProperties(this.attributes);

    for (key in properties) {
      meta = this.constructor.metaForProperty(key);
      if (meta.type && meta.type.serialize) {
        properties[key] = meta.type.serialize(properties[key]);
      } else if (meta.type && Ember.Model.dataTypes[meta.type]) {
        properties[key] = Ember.Model.dataTypes[meta.type].serialize(properties[key]);
      }
    }

    if (this.relationships) {
      var data;
      for(var i = 0; i < this.relationships.length; i++) {
        key = this.relationships[i];
        meta = this.constructor.metaForProperty(key);

        if (meta.kind === 'belongsTo') {
          data = this.serializeBelongsTo(key, meta);
        } else {
          data = this.serializeHasMany(key, meta);
        }

        if (data) {
          properties[key] = data;
        }
      }
    }

    if (this.constructor.rootKey) {
      var json = {};
      json[this.constructor.rootKey] = properties;

      return json;
    } else {
      return properties;
    }
  },

  save: function() {
    var adapter = this.constructor.adapter;
    set(this, 'isSaving', true);
    if (get(this, 'isNew')) {
      return adapter.createRecord(this);
    } else if (get(this, 'isDirty')) {
      return adapter.saveRecord(this);
    } else { // noop, return a resolved promise
      var self = this,
          promise = new Ember.RSVP.Promise(function(resolve, reject) {
            resolve(self);
          });
      set(this, 'isSaving', false);
      return promise;
    }
  },

  reload: function() {
    return this.constructor.reload(this.get(get(this.constructor, 'primaryKey')));
  },

  revert: function() {
    if (this.get('isDirty')) {
      var data = get(this, 'data'),
          reverts = {};
      for (var i = 0; i < this._dirtyAttributes.length; i++) {
        var attr = this._dirtyAttributes[i];
        reverts[attr] = data[attr];
      }
      setProperties(this, reverts);
    }
  },

  didCreateRecord: function() {
    var primaryKey = get(this.constructor, 'primaryKey'),
        id = get(this, primaryKey);

    set(this, 'isNew', false);

    if (!this.constructor.recordCache) this.constructor.recordCache = {};
    this.constructor.recordCache[id] = this;

    this.load(id, this.getProperties(this.attributes));
    this.constructor.addToRecordArrays(this);
    this.trigger('didCreateRecord');
    this.didSaveRecord();
  },

  didSaveRecord: function() {
    set(this, 'isSaving', false);
    this.trigger('didSaveRecord');
    if (this.get('isDirty')) { this._copyDirtyAttributesToData(); }
  },

  deleteRecord: function() {
    return this.constructor.adapter.deleteRecord(this);
  },

  didDeleteRecord: function() {
    this.constructor.removeFromRecordArrays(this);
    set(this, 'isDeleted', true);
    this.trigger('didDeleteRecord');
  },

  _copyDirtyAttributesToData: function() {
    if (!this._dirtyAttributes) { return; }
    var dirtyAttributes = this._dirtyAttributes,
        data = get(this, 'data'),
        key;

    if (!data) {
      data = {};
      set(this, 'data', data);
    }
    for (var i = 0, l = dirtyAttributes.length; i < l; i++) {
      // TODO: merge Object.create'd object into prototype
      key = dirtyAttributes[i];
      data[this.dataKey(key)] = this.cacheFor(key);
    }
    this._dirtyAttributes = [];
  },

  dataDidChange: Ember.observer(function() {
    this._reloadHasManys();
  }, 'data'),

  _registerHasManyArray: function(array) {
    if (!this._hasManyArrays) { this._hasManyArrays = Ember.A([]); }

    this._hasManyArrays.pushObject(array);
  },

  _reloadHasManys: function() {
    if (!this._hasManyArrays) { return; }

    var i;
    for(i = 0; i < this._hasManyArrays.length; i++) {
      var array = this._hasManyArrays[i];
      set(array, 'content', this._getHasManyContent(get(array, 'key'), get(array, 'modelClass'), get(array, 'embedded')));
    }
  },

  _getHasManyContent: function(key, type, embedded) {
    var content = get(this, 'data.' + key);

    if (content) {
      var mapFunction, primaryKey, reference;
      if (embedded) {
        primaryKey = get(type, 'primaryKey');
        mapFunction = function(attrs) {
          reference = type._referenceForId(attrs[primaryKey]);
          reference.data = attrs;
          return reference;
        };
      } else {
        mapFunction = function(id) { return type._referenceForId(id); };
      }
      content = Ember.EnumerableUtils.map(content, mapFunction);
    }

    return Ember.A(content || []);
  }
});

Ember.Model.reopenClass({
  primaryKey: 'id',

  adapter: Ember.Adapter.create(),

  _clientIdCounter: 1,

  fetch: function() {
    return Ember.loadPromise(this.find.apply(this, arguments));
  },

  find: function(id) {
    if (!arguments.length) {
      return this.findAll();
    } else if (Ember.isArray(id)) {
      return this.findMany(id);
    } else if (typeof id === 'object') {
      return this.findQuery(id);
    } else {
      return this.findById(id);
    }
  },

  findMany: function(ids) {
    Ember.assert("findMany requires an array", Ember.isArray(ids));

    var records = Ember.RecordArray.create({_ids: ids});

    if (!this.recordArrays) { this.recordArrays = []; }
    this.recordArrays.push(records);

    if (this._currentBatchIds) {
      concatUnique(this._currentBatchIds, ids);
      this._currentBatchRecordArrays.push(records);
    } else {
      this._currentBatchIds = concatUnique([], ids);
      this._currentBatchRecordArrays = [records];
    }

    Ember.run.scheduleOnce('data', this, this._executeBatch);

    return records;
  },

  findAll: function() {
    if (this._findAllRecordArray) { return this._findAllRecordArray; }

    var records = this._findAllRecordArray = Ember.RecordArray.create();

    this.adapter.findAll(this, records);

    return records;
  },

  _currentBatchIds: null,
  _currentBatchRecordArrays: null,

  findById: function(id) {
    var record = this.cachedRecordForId(id);

    if (!get(record, 'isLoaded')) {
      this._fetchById(record, id);
    }
    return record;
  },

  reload: function(id) {
    var record = this.cachedRecordForId(id);

    this._fetchById(record, id);

    return record;
  },

  _fetchById: function(record, id) {
    var adapter = get(this, 'adapter');

    if (adapter.findMany) {
      if (this._currentBatchIds) {
        if (!contains(this._currentBatchIds, id)) { this._currentBatchIds.push(id); }
      } else {
        this._currentBatchIds = [id];
        this._currentBatchRecordArrays = [];
      }

      Ember.run.scheduleOnce('data', this, this._executeBatch);
      // TODO: return a promise here
    } else {
      return adapter.find(record, id);
    }
  },

  _executeBatch: function() {
    var batchIds = this._currentBatchIds,
        batchRecordArrays = this._currentBatchRecordArrays,
        self = this,
        requestIds = [],
        promise,
        i;

    this._currentBatchIds = null;
    this._currentBatchRecordArrays = null;

    for (i = 0; i < batchIds.length; i++) {
      if (!this.cachedRecordForId(batchIds[i]).get('isLoaded')) {
        requestIds.push(batchIds[i]);
      }
    }

    if (batchIds.length === 1) {
      promise = get(this, 'adapter').find(this.cachedRecordForId(batchIds[0]), batchIds[0]);
    } else {
      var recordArray = Ember.RecordArray.create({_ids: batchIds});
      if (requestIds.length === 0) {
        promise = new Ember.RSVP.Promise(function(resolve, reject) { resolve(recordArray); });
        recordArray.notifyLoaded();
      } else {
        promise = get(this, 'adapter').findMany(this, recordArray, requestIds);
      }
    }

    promise.then(function() {
      for (var i = 0, l = batchRecordArrays.length; i < l; i++) {
        batchRecordArrays[i].loadForFindMany(self);
      }
    });
  },

  findQuery: function(params) {
    var records = Ember.RecordArray.create();

    this.adapter.findQuery(this, records, params);

    return records;
  },

  cachedRecordForId: function(id) {
    if (!this.recordCache) { this.recordCache = {}; }
    var record;

    if (this.recordCache[id]) {
      record = this.recordCache[id];
    } else {
      var primaryKey = get(this, 'primaryKey'),
          attrs = {isLoaded: false};
      attrs[primaryKey] = id;
      record = this.create(attrs);
      var sideloadedData = this.sideloadedData && this.sideloadedData[id];
      if (sideloadedData) {
        record.load(id, sideloadedData);
      }
      this.recordCache[id] = record;
    }

    return record;
  },

  addToRecordArrays: function(record) {
    if (this._findAllRecordArray) {
      this._findAllRecordArray.pushObject(record);
    }
    if (this.recordArrays) {
      this.recordArrays.forEach(function(recordArray) {
        if (recordArray instanceof Ember.FilteredRecordArray) {
          recordArray.registerObserversOnRecord(record);
          recordArray.updateFilter();
        } else {
          recordArray.pushObject(record);
        }
      });
    }
  },

  removeFromRecordArrays: function(record) {
    if (this._findAllRecordArray) {
      this._findAllRecordArray.removeObject(record);
    }
    if (this.recordArrays) {
      this.recordArrays.forEach(function(recordArray) {
        recordArray.removeObject(record);
      });
    }
  },

  // FIXME
  findFromCacheOrLoad: function(data) {
    var record;
    if (!data[get(this, 'primaryKey')]) {
      record = this.create({isLoaded: false});
    } else {
      record = this.cachedRecordForId(data[get(this, 'primaryKey')]);
    }
    // set(record, 'data', data);
    record.load(data[get(this, 'primaryKey')], data);
    return record;
  },

  registerRecordArray: function(recordArray) {
    if (!this.recordArrays) { this.recordArrays = []; }
    this.recordArrays.push(recordArray);
  },

  unregisterRecordArray: function(recordArray) {
    if (!this.recordArrays) { return; }
    Ember.A(this.recordArrays).removeObject(recordArray);
  },

  forEachCachedRecord: function(callback) {
    if (!this.recordCache) { return Ember.A([]); }
    var ids = Object.keys(this.recordCache);
    ids.map(function(id) {
      return this.recordCache[id];
    }, this).forEach(callback);
  },

  load: function(hashes) {
    if (!this.sideloadedData) { this.sideloadedData = {}; }
    for (var i = 0, l = hashes.length; i < l; i++) {
      var hash = hashes[i];
      this.sideloadedData[hash[get(this, 'primaryKey')]] = hash;
    }
  },

  _referenceForId: function(id) {
    if (!this._idToReference) { this._idToReference = {}; }

    var reference = this._idToReference[id];
    if (!reference) {
      reference = this._createReference(id);
    }

    return reference;
  },

  _createReference: function(id) {
    if (!this._idToReference) { this._idToReference = {}; }

    Ember.assert('The id ' + id + ' has alread been used with another record of type ' + this.toString() + '.', !id || !this._idToReference[id]);

    var reference = {
      id: id,
      clientId: this._clientIdCounter++
    };

    // if we're creating an item, this process will be done
    // later, once the object has been persisted.
    if (id) {
      this._idToReference[id] = reference;
    }

    return reference;
  }
});


})();

(function() {

var get = Ember.get;

Ember.hasMany = function(type, options) {
  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'hasMany' },
      key = options.key;

  return Ember.computed(function() {
    if (typeof type === "string") {
      type = Ember.get(Ember.lookup, type);
    }

    return this.getHasMany(key, type, meta);
  }).property().meta(meta);
};

Ember.Model.reopen({
  getHasMany: function(key, type, meta) {
    var embedded = meta.options.embedded,
        collectionClass = embedded ? Ember.EmbeddedHasManyArray : Ember.HasManyArray;

    var collection = collectionClass.create({
      parent: this,
      modelClass: type,
      content: this._getHasManyContent(key, type, embedded),
      embedded: embedded,
      key: key
    });

    this._registerHasManyArray(collection);

    return collection;
  }
});


})();

(function() {

var get = Ember.get;

Ember.belongsTo = function(type, options) {
  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'belongsTo' },
      key = options.key;

  return Ember.computed(function() {
    if (typeof type === "string") {
      type = Ember.get(Ember.lookup, type);
    }

    return this.getBelongsTo(key, type, meta);
  }).property('data').meta(meta);
};

Ember.Model.reopen({
  getBelongsTo: function(key, type, meta) {
    var idOrAttrs = get(this, 'data.' + key),
        record;

    if(Ember.isNone(idOrAttrs)) {
      return null;
    }

    if(meta.options.embedded) {
      var primaryKey = get(type, 'primaryKey');
      record = type.create({ isLoaded: false });
      record.load(idOrAttrs[primaryKey], idOrAttrs);
    } else {
      record = type.findById(idOrAttrs);
    }

    return record;
  }
});


})();

(function() {

var get = Ember.get,
    set = Ember.set,
    meta = Ember.meta;

function wrapObject(value) {
  if (Ember.isArray(value)) {
    var clonedArray = value.slice();

    // TODO: write test for recursive cloning
    for (var i = 0, l = clonedArray.length; i < l; i++) {
      clonedArray[i] = wrapObject(clonedArray[i]);
    }

    return Ember.A(clonedArray);
  } else if (value && value.constructor === Date) {
    return new Date(value.toISOString());
  } else if (value && typeof value === "object") {
    var clone = Ember.create(value), property;

    for (property in value) {
      if (value.hasOwnProperty(property) && typeof value[property] === "object") {
        clone[property] = wrapObject(value[property]);
      }
    }
    return clone;
  } else {
    return value;
  }
}

Ember.Model.dataTypes = {};

Ember.Model.dataTypes[Date] = {
  deserialize: function(string) {
    if(!string) { return null; }
    return new Date(string);
  },
  serialize: function (date) {
    if(!date) { return null; }
    return date.toISOString();
  }
};

Ember.Model.dataTypes[Number] = {
  deserialize: function(string) {
    if (!string && string !== 0) { return null; }
    return Number(string);
  },
  serialize: function (number) {
    if (!number && number !== 0) { return null; }
    return Number(number);
  }
};

function deserialize(value, type) {
  if (type && type.deserialize) {
    return type.deserialize(value);
  } else if (type && Ember.Model.dataTypes[type]) {
    return Ember.Model.dataTypes[type].deserialize(value);
  } else {
    return wrapObject(value);
  }
}


Ember.attr = function(type) {
  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        dataKey = this.dataKey(key),
        dataValue = data && get(data, dataKey),
        beingCreated = meta(this).proto === this;

    if (arguments.length === 2) {
      if (beingCreated && !data) {
        data = {};
        set(this, 'data', data);
        data[dataKey] = value;
      }
      return wrapObject(value);
    }

    return this.getAttr(key, deserialize(dataValue, type));
  }).property('data').meta({isAttribute: true, type: type});
};


})();

(function() {

var get = Ember.get;

Ember.RESTAdapter = Ember.Adapter.extend({
  find: function(record, id) {
    var url = this.buildURL(record.constructor, id),
        self = this;

    return this.ajax(url).then(function(data) {
      self.didFind(record, id, data);
    });
  },

  didFind: function(record, id, data) {
    var rootKey = get(record.constructor, 'rootKey'),
        dataToLoad = rootKey ? data[rootKey] : data;

    record.load(id, dataToLoad);
  },

  findAll: function(klass, records) {
    var url = this.buildURL(klass),
        self = this;

    return this.ajax(url).then(function(data) {
      self.didFindAll(klass, records, data);
    });
  },

  didFindAll: function(klass, records, data) {
    var collectionKey = get(klass, 'collectionKey'),
        dataToLoad = collectionKey ? data[collectionKey] : data;

    records.load(klass, dataToLoad);
  },

  findQuery: function(klass, records, params) {
    var url = this.buildURL(klass),
        self = this;

    return this.ajax(url, params).then(function(data) {
      self.didFindQuery(klass, records, params, data);
    });
  },

  didFindQuery: function(klass, records, params, data) {
      var collectionKey = get(klass, 'collectionKey'),
          dataToLoad = collectionKey ? data[collectionKey] : data;

      records.load(klass, dataToLoad);
  },

  createRecord: function(record) {
    var url = this.buildURL(record.constructor),
        self = this;

    return this.ajax(url, record.toJSON(), "POST").then(function(data) {
      self.didCreateRecord(record, data);
    });
  },

  didCreateRecord: function(record, data) {
    var rootKey = get(record.constructor, 'rootKey'),
        primaryKey = get(record.constructor, 'primaryKey'),
        dataToLoad = rootKey ? data[rootKey] : data;

    record.load(dataToLoad[primaryKey], dataToLoad);
    record.didCreateRecord();
  },

  saveRecord: function(record) {
    var primaryKey = get(record.constructor, 'primaryKey'),
        url = this.buildURL(record.constructor, get(record, primaryKey)),
        self = this;

    return this.ajax(url, record.toJSON(), "PUT").then(function(data) {  // TODO: Some APIs may or may not return data
      self.didSaveRecord(record, data);
    });
  },

  didSaveRecord: function(record, data) {
    record.didSaveRecord();
  },

  deleteRecord: function(record) {
    var primaryKey = get(record.constructor, 'primaryKey'),
        url = this.buildURL(record.constructor, get(record, primaryKey)),
        self = this;

    return this.ajax(url, record.toJSON(), "DELETE").then(function(data) {  // TODO: Some APIs may or may not return data
      self.didDeleteRecord(record, data);
    });
  },

  didDeleteRecord: function(record, data) {
    record.didDeleteRecord();
  },

  ajax: function(url, params, method) {
    return this._ajax(url, params, method || "GET");
  },

  buildURL: function(klass, id) {
    var urlRoot = get(klass, 'url');
    if (!urlRoot) { throw new Error('Ember.RESTAdapter requires a `url` property to be specified'); }

    if (id) {
      return urlRoot + "/" + id + ".json";
    } else {
      return urlRoot + ".json";
    }
  },

  _ajax: function(url, params, method) {
    var settings = {
      url: url,
      type: method,
      dataType: "json"
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (params) {
        if (method === "GET") {
          settings.data = params;
        } else {
          settings.contentType = "application/json; charset=utf-8";
          settings.data = JSON.stringify(params);
        }
      }

      settings.success = function(json) {
        Ember.run(null, resolve, json);
      };

      settings.error = function(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, jqXHR);
      };


      Ember.$.ajax(settings);
   });
  }
});


})();

(function() {

var get = Ember.get;

Ember.LoadPromise = Ember.Object.extend(Ember.DeferredMixin, {
  init: function() {
    this._super.apply(this, arguments);

    var target = get(this, 'target');

    if (get(target, 'isLoaded') && !get(target, 'isNew')) {
      this.resolve(target);
    } else {
      target.one('didLoad', this, function() {
        this.resolve(target);
      });
    }
  }
});

Ember.loadPromise = function(target) {
  if (Ember.isNone(target)) {
    return null;
  } else if (target.then) {
    return target;
  } else {
    return Ember.LoadPromise.create({target: target});
  }
};


})();