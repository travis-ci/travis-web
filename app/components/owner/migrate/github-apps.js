import Component from '@ember/component';

export default Component.extend({

  actions: {

    filterQuery(term) {
      this.repositories.applyFilter(term);
    }

  }

});
