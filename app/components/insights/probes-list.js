import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, equal, gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { EVENTS } from 'travis/utils/dynamic-query';

const { RELOADED } = EVENTS;

export default Component.extend({
  flashes: service(),
  store: service(),
  api: service(),

  toggleButtonText: 'Activate Probes',

  probeModalEditMode: false,
  showProbesModal: false,
  probeType: 'native',

  sortField: 'plugin_type',
  sortDirection: 'asc',
  query: '',

  allowEdit: equal('selectedProbeIds.length', 1),
  allowToggle: gt('selectedProbeIds.length', 0),
  isAllSelected: computed('selectedProbeIds.[]', 'probes.[]', function () {
    return this.selectedProbeIds.length > 0 && this.selectedProbeIds.length === this.probes.length;
  }),
  isAllSelectedChecked: false,
  selectedProbeIds: [],
  selectedProbe: null,
  selectableProbeIds: map('probes', (probe) => probe.id),
  showRemoveProbeModal: false,

  didRender() {
    if (this.probes && Object.keys(this.probes.customOptions).length > 0) {
      if (!this.probes.has(RELOADED)) {
        const self = this;
        this.probes.on(RELOADED, () => {
          self.set('selectedProbeIds', []);
        });
      }

      if (this.probes.customOptions.sort && this.sortField !== this.probes.customOptions.sort) {
        this.set('sortField', this.probes.customOptions.sort);
      }
      if (this.probes.customOptions.sortDirection && this.sortDirection !== this.probes.customOptions.sortDirection) {
        this.set('sortDirection', this.probes.customOptions.sortDirection);
      }
    }
    this.set('isAllSelectedChecked', this.isAllSelected);
  },

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
        this.flashes.success('Probes toggled successfully!');
        self.probes.reload();
        self.set('selectedProbeIds', []);
      });
    }
  }).drop(),

  setToggleButtonName(selectedIds) {
    let allActive = true, allInactive = true;
    for (const id of selectedIds) {
      const probe = this.probes.find(obj => obj.id === id);
      allActive = allActive && probe.status == 'Active';
      allInactive = allInactive && probe.status == 'Inactive';
    }

    if (allActive) {
      this.set('toggleButtonText', `Deactivate Probe${selectedIds.length > 1 ? 's' : ''}`);
    } else if (allInactive) {
      this.set('toggleButtonText', `Activate Probe${selectedIds.length > 1 ? 's' : ''}`);
    } else {
      this.set('toggleButtonText', `Toggle Probe${selectedIds.length > 1 ? 's' : ''}`);
    }
  },

  actions: {
    openNormalProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeModalEditMode', false);
      this.set('selectedProbe', null);
      this.set('probeType', 'native');
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
        const probe =  this.store.peekRecord('insights-probe', this.selectedProbeIds[0]);
        this.set('selectedProbe', probe);
        this.set('probeModalEditMode', true);
        this.set('probeType', probe.type);
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

      this.setToggleButtonName(selectedProbeIds);
      this.set('isAllSelectedChecked', this.isAllSelected);
    },

    toggleAll(evt) {
      const { selectableProbeIds, selectedProbeIds } = this;

      if (selectedProbeIds.length > 0) {
        selectedProbeIds.removeObjects(selectableProbeIds.toArray());
      } else if (selectableProbeIds.length > 0) {
        selectedProbeIds.addObjects(selectableProbeIds.toArray());
      }

      this.setToggleButtonName(selectedProbeIds);
      this.set('isAllSelectedChecked', this.isAllSelected);
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
