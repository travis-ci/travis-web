import Component from '@ember/component';

export default Component.extend({
  selectedRepositories: null,

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
    }

  }
});
