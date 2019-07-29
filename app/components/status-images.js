import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { bindKeyboardShortcuts, unbindKeyboardShortcuts } from 'ember-keyboard-shortcuts';
import { task } from 'ember-concurrency';
import { IMAGE_FORMATS } from 'travis/services/status-images';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['popup', 'status-images'],

  auth: service(),
  externalLinks: service(),
  statusImages: service(),

  repo: null,
  onClose() {},

  formats: Object.keys(IMAGE_FORMATS),

  keyboardShortcuts: {
    'esc': 'toggleStatusImageModal'
  },

  branch: reads('repo.defaultBranch.name'),
  format: reads('formats.firstObject'),

  statusString: computed('format', 'repo.slug', 'branch', function () {
    const { repo, branch, format } = this;
    return this.statusImages[IMAGE_FORMATS[format]](repo, branch);
  }),

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  searchBranches: task(function* (query) {
    const searchResults = yield this.searchBranch.perform(this.repo.id, query);
    return searchResults.mapBy('name');
  }),

  actions: {

    closeModal() {
      this.onClose();
    }

  }

});
