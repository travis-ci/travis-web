import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { reads, gt, and } from '@ember/object/computed';

export default Component.extend({
  api: service(),

  sampleJson: '',
  pluginId: 0,
  selectedPlugin: null,
  pluginOptions: [],
  pluginDataCache: [],

  isRunAllowed: computed('query', 'pluginId', function () {
    return this.pluginId !== 0 && this.query && this.query.length > 0;
  }),
  isQueryValid: true,
  isQueryFilled: gt('query.length', 0),
  isSaveAllowed: and('isQueryValid', 'isQueryFilled'),
  probeOutput: '',

  isQueryRunning: reads('runQuery.isRunning'),

  modalOpenObserver: observer('isOpen', function () {
    if (this.isOpen) {
      this.api.post('/insights_sandbox/plugins',
        {
          data: {
            plugin_type: this.selectedPluginType
          }
        }
      ).then((data) => {
        if (data.no_plugins) {
          this.set('sampleJson', '<Short guide>');
        } else if (data.in_progress) {
          this.set('sampleJson', 'Scan for this plugin is still in progress.\nPlease wait while scan finishes successfully.');
        } else if (data.plugins.length > 0) {
          const plugins = data.plugins.map((plugin) => ({ id: plugin.id, name: plugin.name }));
          this.set('pluginOptions', plugins);
          this.set('selectedPlugin', plugins[0]);
          this.set('pluginId', data.plugins[0].id);
          this.set('sampleJson', data.plugins[0].data);
          this.pluginDataCache[this.pluginId] = this.sampleJson;
        }
      });
    }
  }),

  runQuery: task(function* () {
    this.set('probeOutput', '');

    try {
      yield this.api.post('/insights_sandbox/run_query',
        {
          data: {
            plugin_id: this.pluginId,
            query: this.query
          }
        }
      ).then((data) => {
        if (data.success) {
          if (data.hasOwnProperty('positive_results')) {
            this.set('probeOutput', `> Array of elements that match the query:<br/>${data.positive_results.join('<br/>')}`);
          }
          if (data.hasOwnProperty('negative_results')) {
            this.set(
              'probeOutput',
              `${this.probeOutput}<br/><br/>> Array of elements that do not match the query:<br/>${data.negative_results.join('<br/>')}`
            );
          }
          this.set('isQueryValid', true);
        } else {
          this.set('isQueryValid', false);
          this.set('probeOutput', data.error_syntax_message || data.error_message);
        }
      });
    } catch {
      this.set('probeOutput', 'An error occurred while running the query. Please try again.');
      this.set('isQueryValid', false);
    }
  }).drop(),

  getPluginData: task(function* () {
    yield this.api.post('/insights_sandbox/plugin_data',
      {
        data: {
          plugin_id: this.pluginId
        }
      }
    ).then((data) => {
      this.pluginDataCache[this.pluginId] = data.data;
      this.set('sampleJson', data.data);
    });
  }).drop(),

  clearFields(clearQuery) {
    if (clearQuery) {
      this.set('query', '');
    }
    this.set('pluginId', 0);
    this.set('sampleJson', '');
    this.set('selectedPlugin', null);
    this.set('pluginOptions', []);
    this.set('isQueryValid', true);
    this.set('probeOutput', '');
  },

  actions: {
    clearQuery() {
      this.set('query', '');
    },

    onPluginChange(value) {
      this.set('selectedPlugin', value);
      this.set('pluginId', value.id);

      if (this.pluginDataCache[this.pluginId]) {
        this.set('sampleJson', this.pluginDataCache[this.pluginId]);
      } else {
        this.getPluginData.perform();
      }
    },

    onCloseModal() {
      this.clearFields(true);
      this.onClose();
    },

    onSaveQuery() {
      this.runQuery.perform().then(() => {
        if (this.isQueryValid) {
          this.clearFields(false);
          this.onClose();
        }
      });
    }
  }
});
