import Ember from 'ember';
import config from 'travis/config/environment';
import RESTAdapter from 'ember-data/adapters/rest';

const { service } = Ember.inject;

export default RESTAdapter.extend({
  auth: service(),
  host: config.apiEndpoint,

  sortQueryParams: false,
  coalesceFindRequests: false,
  headers: {
    'Travis-API-Version': '3',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  ajaxOptions: function () {
    var hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    let token = this.get('auth').token();
    if (token) {
      hash.headers['Authorization'] = 'token ' + token;
    }

    return hash;
  },

  findRecord(store, type, id, snapshot) {
    let url = `${this.get('host')}/build/${id}`;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  query(store, type, query, recordArray) {
    console.log('query', query);
    let { repository_id } = query;
    let url = `${this.get('host')}/repo/${repository_id}/builds?event_type=push&include=build.commit`;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then((data) => {
        console.log('v3 builds response data', data);
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  pathForType: function (modelName, id) {
    var underscored = Ember.String.underscore(modelName);
    return id ? underscored :  Ember.String.pluralize(underscored);
  }
});
