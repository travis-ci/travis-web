import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Model.extend({
  api: service(),

  name: attr('string'),
  publicId: attr('string'),
  privateKey: attr('string'),
  pluginType: attr('string'),
  accountName: attr('string'),
  appKey: attr('string'),
  domain: attr('string'),
  subPlugin: attr('string'),
  pluginCategory: attr('string'),
  lastScanEnd: attr('date'),
  scanStatus: attr('string'),
  pluginStatus: attr('string'),

  getScanLogs: task(function* (lastId) {
    return yield this.api.get(`/insights_plugin/${this.id}/get_scan_logs`, {
      data: {
        last_id: lastId
      }
    });
  }).drop(),
});
