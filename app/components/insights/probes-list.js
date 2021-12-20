import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, equal, gt } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';

export default Component.extend({
  flashes: service(),
  store: service(),
  api: service(),

  probeModalEditMode: false,
  showProbesModal: false,
  probeType: 'normal',

  sortField: 'plugin_type',
  sortDirection: 'asc',
  query: '',

  allowEdit: equal('selectedProbeIds.length', 1),
  allowToggle: gt('selectedProbeIds.length', 0),
  isAllSelected: false,
  selectedProbeIds: [],
  selectedProbe: null,
  selectableProbeIds: map('probes', (probe) => probe.id),
  showRemoveProbeModal: false,

  search: task(function* () {
    yield timeout(config.intervals.repositoryFilteringDebounceRate);
    yield this.probes.applyFilter(this.query);
  }).restartable(),

  toggle: task(function* () {
    if (this.selectedProbeIds.length) {
      let data = {
        ids: this.selectedProbeIds,
      };
      const self = this;

      yield this.api.patch('/insights_probes/toggle_active', { data: data }).then(() => {
        self.probes.reload();
        self.set('selectedProbeIds', []);
        self.set('isAllSelected', false);
      });
    }
  }).drop(),

  actions: {
    openNormalProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeModalEditMode', false);
      this.set('selectedProbe', null);
      this.set('probeType', 'normal');
      this.set('showProbesModal', true);
    },

    openCustomProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeModalEditMode', false);
      this.set('selectedProbe', null);
      this.set('probeType', 'custom');
      this.set('showProbesModal', true);
    },

    openEditProbeModal() {
      if (this.selectedProbeIds.length === 1) {
        this.set('selectedProbe', this.store.peekRecord('insights-probe', this.selectedProbeIds[0]));
        this.set('probeModalEditMode', true);
        this.set('probeType', 'custom');
        this.set('showProbesModal', true);
      }
    },

    openDeleteProbeModal() {
      if (this.selectedProbeIds.length) {
        this.set('showRemoveProbeModal', true);
      }
    },

    reloadProbes() {
      this.set('selectedProbeIds', []);
      this.set('isAllSelected', false);
      this.probes.reload();
    },

    toggleProbe(probeId) {
      const { selectedProbeIds } = this;
      const isSelected = selectedProbeIds.includes(probeId);

      if (isSelected) {
        selectedProbeIds.removeObject(probeId);
      } else {
        selectedProbeIds.addObject(probeId);
      }
    },

    toggleAll() {
      const { isAllSelected, selectableProbeIds, selectedProbeIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedProbeIds.removeObjects(selectableProbeIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedProbeIds.addObjects(selectableProbeIds.toArray());
      }
    },

    applySort(field) {
      if (field === this.sortField) {
        this.set('sortDirection', this.sortDirection === 'desc' ? 'asc' : 'desc');
      }
      this.set('sortField', field);

      this.probes.applyCustomOptions({ sort: field, sortDirection: this.sortDirection });
    }
  },
});
