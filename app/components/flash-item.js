import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['type', 'topBarVisible:below-top-bar:fixed'],

  flashes: service(),

  type: computed('flash.type', function () {
    let type = this.get('flash.type');
    return type || 'broadcast';
  }),

  topBarVisible: alias('flashes.topBarVisible'),

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  }
});
