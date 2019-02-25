import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  selectedRepositories: null,

  isAllSelected: computed('selectedRepositories.[]', 'repositories.[]', function () {
    return this.selectedRepositories.length === this.repositories.length;
  }),

  init() {
    this.set('selectedRepositories', []);
    return this._super(...arguments);
  },

  actions: {

    toggleRepository(repo) {
      const { selectedRepositories } = this;
      const isSelected = selectedRepositories.includes(repo);
      if (isSelected) {
        selectedRepositories.removeObject(repo);
      } else {
        selectedRepositories.addObject(repo);
      }
    },

    toggleAll() {
      if (this.isAllSelected) {
        this.selectedRepositories.clear();
      } else {
        this.selectedRepositories.addObjects(this.repositories);
      }
    }

  }

});
