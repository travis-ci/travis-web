import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dateCenter: null,
  dateRange: null,
  showDatePicker: false,
  summarizedUsers: computed('owner.executions', 'dateRange', function () {

  })
});
