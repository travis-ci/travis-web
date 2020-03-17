import Component from '@ember/component';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';

export default Component.extend({
  tagName: 'p',
  classNames: ['request-configs-trigger-build-notice'],

  configs: 0,
  customize: false,

  message: computed('customize', 'configs', function () {
    let configs = pluralize(this.configs + 1, 'config', { withoutCount: true });
    if (this.customize) configs = `details and ${configs}`;
    return `Trigger a build request with the following build ${configs}`;
  }),
});
