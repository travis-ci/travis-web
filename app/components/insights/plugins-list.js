import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt, reads } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import { EVENTS } from 'travis/utils/dynamic-query';

const { RELOADED } = EVENTS;

export default Component.extend({
  flashes: service(),
  api: service(),
  preferences: service(),

  timeZone: computed('preferences.insightsTimeZone', function () {
    if (this.preferences.insightsTimeZone) {
      return this.preferences.insightsTimeZone.substr(this.preferences.insightsTimeZone.indexOf(')') + 2);
    } else return '';
  }),
  dateFormat: reads('preferences.insightsDateFormat'),
  timeFormat: reads('preferences.insightsTimeFormat'),
  momentFormat: computed('dateFormat', 'timeFormat', function () {
    return `${this.dateFormat} ${this.timeFormat}`;
  }),

  toggleButtonText: 'Activate Plugins',

  showPluginsModal: false,
  showRemovePluginModal: false,
  showScanLogModal: false,

  sortField: 'name',
  sortDirection: 'asc',
  query: '',

  isAllSelected: computed('selectedPluginIds', 'plugins', function () {
    return this.selectedPluginIds.length > 0 && this.selectedPluginIds.length === this.plugins.length;
  }),
  allowToggle: gt('selectedPluginIds.length', 0),
  selectedPluginIds: [],
  selectablePluginIds: map('plugins', (plugin) => plugin.id),
  scanLogPlugin: null,

  didRender() {
    if (this.plugins && Object.keys(this.plugins.customOptions).length > 0) {
      if (!this.plugins.has(RELOADED)) {
        const self = this;
        this.plugins.on(RELOADED, () => {
          self.set('selectedPluginIds', []);
        });
      }

      if (this.plugins.customOptions.sort && this.sortField !== this.plugins.customOptions.sort) {
        this.set('sortField', this.plugins.customOptions.sort);
      }
      if (this.plugins.customOptions.sortDirection && this.sortDirection !== this.plugins.customOptions.sortDirection) {
        this.set('sortDirection', this.plugins.customOptions.sortDirection);
      }
    }
  },

  setToggleButtonName(selectedIds) {
    let allActive = true, allInactive = true;
    for (const id of selectedIds) {
      const plugin = this.plugins.find(obj => obj.id === id);
      allActive = allActive && plugin.pluginStatus == 'Active';
      allInactive = allInactive && plugin.pluginStatus == 'Inactive';
    }

    if (allActive) {
      this.set('toggleButtonText', `Deactivate Plugin${selectedIds.length > 1 ? 's' : ''}`);
    } else if (allInactive) {
      this.set('toggleButtonText', `Activate Plugin${selectedIds.length > 1 ? 's' : ''}`);
    } else {
      this.set('toggleButtonText', `Toggle Plugin${selectedIds.length > 1 ? 's' : ''}`);
    }
  },

  actions: {
    reloadPlugins() {
      this.plugins.reload();
      this.set('selectedPluginIds', []);
    },

    togglePlugin(pluginId) {
      const { selectedPluginIds } = this;
      const isSelected = selectedPluginIds.includes(pluginId);

      if (isSelected) {
        selectedPluginIds.removeObject(pluginId);
      } else {
        selectedPluginIds.addObject(pluginId);
      }

      this.setToggleButtonName(selectedPluginIds);
    },

    toggleAll() {

      const { selectablePluginIds, selectedPluginIds } = this;

      if (selectedPluginIds.length > 0) {
        selectedPluginIds.removeObjects(selectablePluginIds.toArray());
      } else {
        selectedPluginIds.addObjects(selectablePluginIds.toArray());
      }

      this.setToggleButtonName(selectedPluginIds);
    },

    applySort(field) {
      if (field === this.sortField) {
        this.set('sortDirection', this.sortDirection === 'desc' ? 'asc' : 'desc');
      }
      this.set('sortField', field);

      this.plugins.applyCustomOptions({ sort: field, sortDirection: this.sortDirection });
    },

    openScanLogModal(plugin) {
      this.set('scanLogPlugin', plugin);
      this.set('showScanLogModal', true);
    },

    openDeleteProbeModal() {
      if (this.selectedPluginIds.length) {
        this.set('showRemovePluginModal', true);
      }
    }
  },

  toggle: task(function* () {
    if (this.selectedPluginIds.length) {
      let data = {
        ids: this.selectedPluginIds,
      };
      const self = this;

      yield this.api.patch('/insights_plugins/toggle_active', { data: data }).then(() => {
        this.flashes.success('Plugins toggled successfully!');
        self.plugins.reload();
        self.set('selectedPluginIds', []);
      });
    }
  }).drop(),

  search: task(function* () {
    yield timeout(config.intervals.repositoryFilteringDebounceRate);
    yield this.plugins.applyFilter(this.query);
  }).restartable(),

  init() {
    this._super(...arguments);
    this.preferences.fetchPreferences.perform();
  }
});
