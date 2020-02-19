import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-config'],
  classNameBindings: ['expanded:request-config-expanded'],
  copied: false,
  expanded: true,

  toggleStatusClass: computed('expanded', function () {
    return this.expanded ? 'expanded' : 'collapsed';
  }),

  buttonLabel: computed('copied', function () {
    return this.copied ? 'Copied!' : 'Copy build config';
  }),

  formattedConfig: computed('config', 'slug', function () {
    const config = this.config;
    try {
      return JSON.stringify(config, null, 2);
    } catch (e) {
      return config;
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
