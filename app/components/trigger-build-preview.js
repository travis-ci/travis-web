import Component from '@ember/component';
import { computed } from '@ember/object';
import { match } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['trigger-build-preview', 'status'],

  yml: service(),
  status: 'validating',
  validating: match('status', /validating/),
  expanding: match('status', /expanding/),

  formattedConfig: computed('config', function () {
    return JSON.stringify(this.merged, null, 2);
  }),

  formattedMatrix: computed('matrix', function () {
    return JSON.stringify(this.matrix, null, 2);
  }),

  configs: computed('request.uniqRawConfigs', 'config', function () {
    let configs = this.get('request.uniqRawConfigs') || [];
    if (this.config) {
      configs = configs.reject(config => config.source === 'api');
      configs.unshift({ config: this.config, source: 'api' });
    }
    return configs;
  }),

  didInsertElement: function () {
    this.validate();
  },

  validate: function () {
    this.yml.validate(this.configs).
      then(this.validationSuccess.bind(this), this.validationError.bind(this)).
      finally(this.expand.bind(this));
  },

  validationSuccess: function (data) {
    this.set('merged', data.config);
    this.set('messages', data.messages);
  },

  validationError: function () {
    // TODO
    // this.set('matrix', undefined);
    // this.set('messages', undefined);
  },

  expand: function () {
    this.set('status', 'expanding')
    this.yml.expand(this.merged).
      then(this.expandSuccess.bind(this), this.expandError.bind(this)).
      finally(() => this.set('status', 'preview'));
  },

  expandSuccess: function (data) {
    this.set('matrix', data);
  },

  expandError: function () {
    // TODO
    // this.set('matrix', undefined);
    // this.set('messages', undefined);
  },
});
