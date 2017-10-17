import Component from '@ember/component';

export default Component.extend({
  classNames: ['organisation-filter'],
  classNameBindings: ['showFilter:is-open'],

  actions: {
    toggleOrgFilter() {
      this.toggleProperty('showFilter');
      return false;
    },
    select(org) {
      this.toggleProperty('showFilter');
      this.set('showFilter', false);
      return this.sendAction('action', org);
    }
  }
});
