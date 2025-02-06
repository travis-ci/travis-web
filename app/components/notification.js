import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  type: '',
  severity: 'error',
  style: '',

  isGlobal: equal('type', 'global'),

  getNotificationClass: computed('type', 'severity', function () {
    const sev = this.severity === '' ? 'error' : this.severity;
    const pre = this.type === 'global' ? 'global-' : '';
    return `${pre}notification-${sev}`;
  }),
});
