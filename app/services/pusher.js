import Service from '@ember/service';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service store: null,
  @service liveUpdatesRecordFetcher: null,

  receive(event, data) {
  },

  loadOne(type, json) {
  }
});
