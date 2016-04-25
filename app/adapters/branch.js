import Ember from 'ember';
import ApplicationAdapter from 'travis/adapters/application';

export default ApplicationAdapter.extend({

  query(store, type, query) {
    var repo_id = query.repository_id;
    delete query.repository_id;
    return this.ajax( this.urlPrefix() + '/v3/repo/' + repo_id + '/branches', 'GET', query);
  },

  findRecord(store, type, id, record) {
    return this.ajax(this.urlPrefix() + id, 'GET');
  },

});
