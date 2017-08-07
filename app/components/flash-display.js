import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service flashes: null,

  classNames: ['flash'],
  tagName: 'ul',

  @alias('flashes.messages') messages: null,

  actions: {
    closeMessage(msg) {
      return this.get('flashes').close(msg);
    }
  }
});
