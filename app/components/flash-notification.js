import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from "@ember/service";


export default Component.extend({

  flashes: service(),

  tagName: '',
  severity: 'error',
  style: '',
  componentName: '',

  getNotificationClass: computed('severity', function () {
    const sev = this.severity === '' ? 'error' : this.severity;
    return `global-notification-${sev}`;
  }),

  actions: {
    close() {
      return this.flashes.flashes.filterBy('className', this.componentName).forEach(flash => this.flashes.flashes.removeObject(flash));
    }
  }
});
