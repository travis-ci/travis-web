import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { equal, reads } from '@ember/object/computed';
import BranchSearching from 'travis/mixins/branch-searching';
import SOURCES from 'travis/models/request';
import { bindKeyboardShortcuts, unbindKeyboardShortcuts } from 'ember-keyboard-shortcuts';

export default Component.extend(BranchSearching, {
  tagName: '',

  repo: reads('request.repo'),
  requestConfig: reads('preview.config'),
  replacing: equal('configs.lastObject.mergeMode', 'replace'),

  rawConfigs: computed('preview.rawConfigs', function () {
    const configs = this.preview.rawConfigs;
    if (configs) {
      return configs.reject(config => config.source.slice(0, 3) == SOURCES.API);
    }
  }),

  keyboardShortcuts: {
    'shift+enter': 'submit'
  },

  onUpdate() {},
  onSubmit() {},

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  actions: {
    add(ix) {
      this.onAdd(ix);
    },

    remove(ix) {
      this.onRemove(ix);
    },

    update() {
      this.onUpdate(...arguments);
    },

    submit() {
      this.onSubmit();
    }
  }
});
