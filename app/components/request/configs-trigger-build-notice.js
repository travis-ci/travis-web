import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { pluralize } from 'ember-inflector';

export default Component.extend({
  tagName: 'p',
  classNames: ['request-configs-trigger-build-notice'],

  configs: 0,
  status: undefined,
  customizing: equal('status', 'customize'),
  previewing: equal('status', 'preview'),

  message: computed('customize', 'configs', function () {
    if (this.previewing) {
      return 'The triggered build will have the following build config and job matrix.';
    }
    let configs = pluralize(this.configs + 1, 'config', { withoutCount: true });
    if (this.customize) configs = `details and ${configs}`;
    return `Trigger a build request with the following build ${configs}`;
  }),
});
