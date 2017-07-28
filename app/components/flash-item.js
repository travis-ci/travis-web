import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['type', 'topBarVisible:below-top-bar:fixed'],

  @service flashes: null,

  @computed('flash.type')
  type(type) {
    return type || 'broadcast';
  },

  @alias('flashes.topBarVisible') topBarVisible: null,

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  },
});
