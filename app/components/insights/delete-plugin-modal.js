import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),
  flashes: service(),

  selectedPluginIds: [],

  deletePlugins: task(function* () {
    let data = {
      ids: this.selectedPluginIds,
    };
    const self = this;

    yield this.api.delete('/insights_plugins/delete_many', { data: data }).then(() => {
      this.flashes.success('Plugins deleted successfully!');
      self.reloadPlugins();
      self.onClose();
    });
  }).drop(),
});
