import Ember from 'ember';
import connect from 'ember-redux/components/connect';

let filterRepositories = function(repos, filter, org) {
  repos = repos.filter(function(item, index) {
    if (item.get('default_branch')) {
      return item.getIn(['default_branch', 'last_build']) !== null;
    }
  }).sortBy( (repo) => repo.getIn('default_branch', 'last_build', 'finished_at') ).reverse();
  if (org) {
    repos = repos.filter(function(item, index) {
      return item.getIn(['owner', 'login']) === org;
    });
  }
  if (Ember.isBlank(filter)) {
    return repos.toJS();
  } else {
    return repos.filter(function(item, index) {
      return item.get('slug').match(new RegExp(filter));
    }).toJS();
  }
};

let stateToComputed = (state) => {
  let filter = state.dashboard.filter,
      org    = state.dashboard.org ? state.dashboard.org.login : null;

  return {
    repositories: filterRepositories(state.repositories.get('all'), filter, org),
  };
};

let dispatchToActions = (dispatch) => {
  return {
    //remove: (id) => ajax(`/api/users/${id}`, 'DELETE').then(() => dispatch({type: 'REMOVE_USER', id: id}))
  };
};

let DashboardRepositoriesListComponent = Ember.Component.extend({});

export default connect(stateToComputed, dispatchToActions)(DashboardRepositoriesListComponent);
