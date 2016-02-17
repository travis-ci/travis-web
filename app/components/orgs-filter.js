import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['organisation-filter'],
  actions: {
    toggleOrgFilter() {
      this.toggleProperty('showFilter');
      return false;
    },

    select(org) {
      this.toggleProperty('showFilter');
      return this.sendAction('action', org);
    }
  }
});
