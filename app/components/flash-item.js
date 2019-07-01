import Component from '@ember/component';
import { computed } from '@ember/object';
import { or, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['type', 'isFixed:fixed:below-top-bar'],

  flashes: service(),

  type: computed('flash.type', function () {
    let type = this.get('flash.type');
    return type || 'broadcast';
  }),

  topBarNotVisible: not('flashes.topBarVisible'),
  isFixed: or('topBarNotVisible', 'flash.aboveOverlay'),

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  }
});
