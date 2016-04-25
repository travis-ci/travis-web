import Ember from 'ember';
import connect from 'ember-redux/components/connect';

let stateToComputed = (state) => {
  let selectedOrg = state.dashboard.org;

  return { selectedOrg };
}

let Component = Ember.Component.extend({
  redux: Ember.inject.service(),

  classNames: ['organisation-filter'],
  actions: {
    toggleOrgFilter() {
      this.toggleProperty('showFilter');
      return false;
    },

    select(org) {
      this.toggleProperty('showFilter');
      this.get('redux').dispatch({ type: 'CHANGE_ORG', org: org });
    }
  }
});

export default connect(stateToComputed, null)(Component);
