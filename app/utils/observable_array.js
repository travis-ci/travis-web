import EmberObject from '@ember/object';
import {A} from '@ember/array'
import {reads} from "@ember/object/computed";

const ObservableArrayBase = EmberObject.extend({

  length: reads('_content.length'),

  init() {
    this._super(...arguments);
    this._content = A();
    this.observers = [];
  },

  addArrayObserver(observer) {
    this.observers.push(observer);
  },

  removeArrayObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  },

  notifyObservers(method, ...args) {
    this.observers.forEach(observer => {
      if (typeof observer[method] === 'function') {
        observer[method](this, ...args);
      }
    });
  },


  pushObject(item) {
    this.notifyObservers('willChange', this._content.length, 0, 1);
    this._content.pushObject(item);
    this.notifyObservers('didChange', this._content.length - 1, 0, 1);
    return this._content.length;
  },

  addObject(item) {
    this.pushObject(item)
  },

  removeObject(item) {
    this.notifyObservers('willChange', this._content.length, 0, 1);
    this._content.removeObject(item)
    this.notifyObservers('didChange', this._content.length - 1, 0, 1);
    return this._content.length;
  },

  push(item) {
    return this.pushObject(item)
  },

  find(...params) {
    return this._content.find(...params)
  },

  findBy(...params) {
    return this._content.findBy(...params)
  },

  map(...params) {
    return this._content.map(...params)
  },

  forEach(...params) {
    return this._content.map(...params)
  },

  firstObject(...params) {
    return this._content.map(...params)
  },

  filterBy(...params) {
    return this._content.filterBy(...params)
  },

  filter(...params) {
    return this._content.filterBy(...params)
  },

  slice(...params) {
    return this._content.slice(...params);
  },

  isAny(...params) {
    return this._content.isAny(...params);
  },

  get(_target, prop, _receiver) {
    if(prop in this._content) {
      return this._content[prop]
    } else {
      return undefined;
    }
  },

  set(_target, prop, value, _receiver) {
    // Custom behavior when setting a property
    this._content[prop] = value;

    // You must return true to indicate that assignment succeeded
    return true;
  },

  content() {
    return this._content.toArray();
  }
})

export function asObservableArray(array) {
  let observableArray = ObservableArrayBase.create();
  array.forEach(item => observableArray.pushObject(item));
  return observableArray;
}
