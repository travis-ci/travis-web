import Component from '@ember/component';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';

export default Component.extend({
  tagName: 'p',
  classNames: ['trigger-build-description'],

  configs: 0,
  customize: false,

  message: computed('customize', 'configs', function () {
    let msg = ['Trigger a build request with the following'];
    if (this.customize) {
      msg.push('details and');
    }
    msg.push(`build ${pluralize(this.configs + 1, 'config', { withoutCount: true })}`);
    return msg.join(' ');
  }),
});
