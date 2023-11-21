import EmberObject from '@ember/object';
import {A} from '@ember/array'

const ObservableArrayBase = EmberObject.extend({
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
    this._content.push(item);
    this.notifyObservers('didChange', this._content.length - 1, 0, 1);
    return this._content.length;
  },

  push(item) {
    this.pushObject(item)
  },

  find(...params) {
    this._content.find(...params)
  },

  map(...params) {
    this._content.map(...params)
  },

  forEach(...params) {
    this._content.map(...params)
  },

  firstObject(...params) {
    this._content.map(...params)
  },
})

export function asObservableArray(array) {
  let observableArray = ObservableArrayBase.create();
  array.forEach(item => observableArray.pushObject(item));
  return observableArray;
}
