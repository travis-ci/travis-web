import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  ajaxOptions: function () {
    var hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    let token = this.get('auth').token();
    if (token) {
      hash.headers['Authorization'] = 'token ' + token;
    }

    return hash;
  },

  findRecord(store, type, id) {
    let url = `${this.get('host')}/build/${id}`;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then(function (data) {
        Ember.run(null, resolve, data);
      }, function (jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  query(store, type, query) {
    let { repository_id } = query;
    // eslint-disable-next-line
    let url = `${this.get('host')}/repo/${repository_id}/builds?event_type=push&include=build.commit,build.branch`;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then((data) => {
        Ember.run(null, resolve, data);
      }, function (jqXHR) {
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
