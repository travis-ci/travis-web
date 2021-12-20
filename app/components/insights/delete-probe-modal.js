import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),
  flashes: service(),

  selectedProbeIds: [],

  deleteProbes: task(function* () {
    let data = {
      ids: this.selectedProbeIds,
    };
    const self = this;

    yield this.api.delete('/insights_probes/delete_many', { data: data }).then(() => {
      this.flashes.success('Probes deleted successfully!');
      self.set('selectedProbeIds', []);
      self.reloadProbes();
      self.onClose();
    });
  }).drop(),
});
