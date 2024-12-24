import Component from '@ember/component';
import { computed } from '@ember/object';
import { notEmpty,equal } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  type: '',
  severity: 'error',
  style: '',
  icon: '',

  hasIcon: notEmpty('icon'),
  isGlobal: equal('type', 'global'),
                                /*
  isGlobal: computed('type', function() {
    console.log(`global: ${this.type == 'global'}`)
    return this.type == 'global';
  }),*/

  getNotificationClass: computed('type', 'severity', function() {
    const sev = this.severity == '' ? 'error' : this.severity;
    const pre = this.type == 'global' ? 'global-' : '';
    return `${pre}notification-${sev} ${this.style}`;
  }),

  getIcon: computed('icon', function() {
    return this.icon;
  }),

  getIconClass: computed('icon', function() {
    let iconClass=this.icon;
    switch(this.severity) {
    case 'warning':
      iconClass += ` ${this.icon}-yellow`;
      break;
    default:
    }
    return iconClass;
  }),


});
