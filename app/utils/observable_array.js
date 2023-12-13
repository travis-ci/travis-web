import {reads} from "@ember/object/computed";
import ArrayProxy from "@ember/array/proxy";
import { A } from '@ember/array';
import {resolve} from "rsvp";

const ObservableArrayBase = ArrayProxy.extend({

  length: reads('_content.length'),

  init() {
    this._super(...arguments);
    this._content = null; // set in asObservableArray function
    this.observers = [];
  },

  addArrayObserver(observer, options) {
    const mergedObserver = { observer: observer, options: options }
    this.observers.push(mergedObserver);
  },

  removeArrayObserver(observer, options) {
    // there was no need to implement this method at all and do not use array observers please...
    this.observers = this.observers.filter(obs => obs !== observer);
  },

  notifyObservers(method, ...args) {
    this.observers.forEach(observerWithOptions => {
      let actualMethodToCall = observerWithOptions.options[method];
      let observer = observerWithOptions.observer;
      if (typeof observer[actualMethodToCall] === 'function') {
        observer[actualMethodToCall](...args);
      }
    });
  },


  pushObject(item) {
    this.notifyObservers('willChange', this._content, this._content.length, 0, 1);
    this._content.pushObject(item);
    this.notifyObservers('didChange', this._content, this._content.length - 1, 0, 1);
    return this._content.length;
  },

  addObject(item) {
    this.pushObject(item)
  },

  removeObject(item) {
    this.notifyObservers('willChange', this._content, this._content.length, 1, 0);
    this._content.removeObject(item)
    this.notifyObservers('didChange', this._content, this._content.length -1 , 1, 0);
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
    return this._content;
  },
})


export function asObservableArray(array) {
  let observableArray = ObservableArrayBase.create();
  observableArray._content = array;
  return observableArray;
}



export default ObservableArrayBase;
