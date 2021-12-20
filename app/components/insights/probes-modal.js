import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads } from '@ember/object/computed';

import config from 'travis/config/environment';

import { default as M } from 'materialize-css';

const { newInsights } = config;

export default Component.extend({
  api: service(),
  accounts: service(),
  store: service(),
  flashes: service(),

  owner: reads('accounts.user'),

  init() {
    this._super(...arguments);

    this.set('plugins', this.owner.insightsPlugins);
  },

  probeSeverityValues: ['info', 'low', 'med', 'high'],

  probeQueryEditorModal: false,
  showHelpLinkInput: false,
  plugins: null,
  selectedPlugin: null,
  pluginCategory: null,

  chipsInstance: null,

  notification: '',
  description: '',
  query: '',
  overlayType: '',
  overlayLabelsName: '',
  overlaysLabelsUrl: '',
  tags: '',
  furtherReadingLink: '',
  sponsorName: '',
  sponsorUrl: '',
  probeSeverity: 0,
  probeSeverityLabel: computed('probeSeverity', function () {
    return this.probeSeverityValues[this.probeSeverity];
  }),

  pluginOptions: computed('plugins.@each', function () {
    const options = this.plugins.map((plugin) => (
      { id: newInsights.pluginTypes.find(type => (type.name === plugin.pluginType)).id, name: plugin.pluginType }
    ));
    return [...new Map(options.map(item => [item.name, item])).values()];
  }),
  probeOptions: [],
  selectedProbe: null,

  isQueryEditAllowed: computed('probeType', 'selectedPlugin', 'selectedProbe', function () {
    return (this.probeType === 'custom' && this.selectedPlugin) || (this.probeType === 'normal' && this.selectedPlugin && this.selectedProbe);
  }),
  isSaveAllowed: computed('isQueryEditAllowed', 'query', function () {
    return this.isQueryEditAllowed && this.query.length;
  }),

  modalOpenObserver: observer('isOpen', function () {
    if (this.isOpen) {
      if (this.editMode) {
        this.set('pluginCategory', this.probe.pluginCategory);
        this.set('selectedPlugin', this.pluginOptions.find(obj => obj.id === this.probe.pluginType));
        this.set('notification', this.probe.notification);
        this.set('description', this.probe.description);
        this.set('query', this.probe.test);
        if (this.probe.descriptionLink) {
          this.set('showHelpLinkInput', true);
          this.set('furtherReadingLink', this.probe.descriptionLink);
        }
        this.set('sponsorName', this.probe.sponsorName);
        this.set('sponsorUrl', this.probe.sponsorUrl);
        this.set('probeSeverity', this.probeSeverityValues.indexOf(this.probe.severity));
      }

      const self = this;
      this.api.get('/insights_tags').then((data) => {
        let elems = document.querySelectorAll('.chips-input');
        let tagData = {};
        data.tags.forEach((tag) => {
          tagData[tag.name] = null;
        });
        self.set('chipsInstance', M.Chips.init(elems, {
          placeholder: '+Add Tag',
          secondaryPlaceholder: '+Add Tag',
          data: self.editMode ? self.probe.tagList.map((el) => ({tag: el.name})) : [],
          limit: 10,
          autocompleteOptions: {
            data: tagData,
            minLength: 1
          }
        })[0]);
      });
    } else {
      this.clearFields();
    }
  }),

  save: task(function* () {
    this.set('tags', this.chipsInstance.chipsData.map((chip) => chip.tag).join());

    try {
      let params = {
        testTemplateId: this.selectedProbe ? this.selectedProbe.id : null,
        notification: this.notification,
        description: this.description,
        test: this.query,
        labels: {
          sponsor_name: this.sponsorName,
          sponsor_url: this.sponsorUrl
        },
        descriptionLink: this.furtherReadingLink,
        tagList: this.tags,
        severity: this.probeSeverityLabel
      };
      if (this.editMode) {
        this.probe.setProperties(params);
        yield this.probe.save();
      } else {
        params['type'] = this.probeType;
        params['pluginType'] = this.selectedPlugin.id;
        yield this.store.createRecord('insights-probe', params).save();
      }
      this.reloadProbes();
      this.onClose();
      this.flashes.success('Probe Template saved successfully.');
    } catch (error) {
      if (this.editMode) {
        this.probe.rollbackAttributes();
      }
      this.onClose();
      this.flashes.error('Probe Template save failed.');
    }
  }).drop(),

  clearFields: function () {
    this.set('showHelpLinkInput', false);
    this.set('selectedPlugin', null);
    this.set('pluginCategory', null);
    this.set('notification', '');
    this.set('description', '');
    this.set('query', '');
    this.set('tags', '');
    this.set('furtherReadingLink', '');
    this.set('sponsorName', '');
    this.set('sponsorUrl', '');
    this.set('probeSeverity', 0);
  },

  actions: {
    openQueryEditor() {
      if (this.isQueryEditAllowed) {
        this.set('probeQueryEditorModal', true);
      }
    },

    closeModal() {
      this.set('selectedPlugin', null);
      this.set('selectedProbe', null);
      this.onClose();
    },

    async getProbeOptions(option) {
      this.set('selectedPlugin', option);
      const response = await this.api.get('/insights_plugins/template_plugin_tests',
        {
          data: {
            plugin_type: this.selectedPlugin.id
          }
        }
      );
      this.set('pluginCategory', response['plugin_category']);
      this.set('probeOptions', response['template_tests']);
    },

    getProbeData(probe) {
      this.set('selectedProbe', probe);
      const data = this.store.peekRecord('insights-probe', probe.id);
      this.set('notification', data.notification);
      this.set('description', data.description);
      this.set('query', data.test);
      if (data.descriptionLink) {
        this.set('showHelpLinkInput', true);
        this.set('furtherReadingLink', data.descriptionLink);
      }
      this.set('sponsorName', data.sponsorName);
      this.set('sponsorUrl', data.sponsorUrl);
      const self = this;
      data.tagList.forEach((el) => {
        self.chipsInstance.addChip({tag: el.name});
      });
    }
  }
});
