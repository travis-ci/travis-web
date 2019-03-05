import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  selectedRepositories: null,
  selectionLimit: null,

  isAllSelected: computed('selectedRepositories.[]', 'repositories.[]', function () {
    const { selectedRepositories, repositories } = this;
    return repositories.every(repo => selectedRepositories.includes(repo));
  }),

  showSelectAll: computed('repositories.[]', function () {
    return this.repositories.length > 1;
  }),

  isSelectionAllowed: computed('selectedRepositories.[]', 'selectionLimit', function () {
    const { selectedRepositories, selectionLimit } = this;
    return !selectionLimit || selectedRepositories.length < selectionLimit;
  }),

  init() {
    this.set('selectedRepositories', []);
    return this._super(...arguments);
  },

  actions: {

    toggleRepository(repo) {
      if (!this.isSelectionAllowed) return;

      const { selectedRepositories } = this;
      const isSelected = selectedRepositories.includes(repo);

      if (isSelected) {
        selectedRepositories.removeObject(repo);
      } else {
        selectedRepositories.addObject(repo);
      }
    },

    toggleAll() {
      const { isAllSelected, repositories, selectionLimit, selectedRepositories } = this;

      if (isAllSelected) {
        selectedRepositories.removeObjects(repositories);
      } else {
        selectedRepositories.addObjects(repositories.slice(0, selectionLimit || repositories.length));
      }
    }

  }

});
