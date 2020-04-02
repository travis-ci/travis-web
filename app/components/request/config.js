import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  copied: false,
  expanded: true,

  status: computed('expanded', function () {
    return this.expanded ? 'expanded' : 'collapsed';
  }),

  buttonLabel: computed('copied', function () {
    return this.copied ? 'Copied' : 'Copy';
  }),

  formattedConfig: computed('config', function () {
    try {
      return JSON.stringify(this.config, null, 2);
    } catch (e) {
      return this.config;
    }
  }),

  actions: {
    copied() {
      this.set('copied', true);
      later(() => this.set('copied', false), 3000);
    },
    toggle() {
      this.toggleProperty('expanded');
    }
  }
});
