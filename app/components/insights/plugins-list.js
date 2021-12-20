import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt, reads } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

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

  showPluginsModal: false,
  showRemovePluginModal: false,
  showScanLogModal: false,

  sortField: 'name',
  sortDirection: 'asc',
  query: '',

  isAllSelected: false,
  allowToggle: gt('selectedPluginIds.length', 0),
  selectedPluginIds: [],
  selectablePluginIds: map('plugins', (plugin) => plugin.id),
  scanLogPlugin: null,

  actions: {
    reloadPlugins() {
      this.plugins.reload();
      this.set('selectedPluginIds', []);
      this.set('isAllSelected', false);
    },

    togglePlugin(pluginId) {
      const { selectedPluginIds } = this;
      const isSelected = selectedPluginIds.includes(pluginId);

      if (isSelected) {
        selectedPluginIds.removeObject(pluginId);
      } else {
        selectedPluginIds.addObject(pluginId);
      }
    },

    toggleAll() {
      const { isAllSelected, selectablePluginIds, selectedPluginIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedPluginIds.removeObjects(selectablePluginIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedPluginIds.addObjects(selectablePluginIds.toArray());
      }
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
        self.plugins.reload();
        self.set('selectedPluginIds', []);
        self.set('isAllSelected', false);
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
