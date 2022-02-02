import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),

  selectedProbeIds: [],

  deleteProbes: task(function* () {
    let data = {
      ids: this.selectedProbeIds,
    };
    const self = this;

    yield this.api.delete('/insights_probes/delete_many', { data: data }).then(() => {
      self.set('selectedProbeIds', []);
      self.reloadProbes();
      self.onClose();
    });
  }).drop(),
});
