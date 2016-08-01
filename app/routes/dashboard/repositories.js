import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  model() {
    let repos = this.store.query('repo', {active: true});
    return repos;
  }
});
