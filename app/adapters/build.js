import Ember from 'ember';
import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  ajaxOptions: function () {
    const hash = this._super(...arguments);

    hash.headers = hash.headers || {};

    let token = this.get('auth').token();
    if (token) {
      hash.headers['Authorization'] = `token ${token}`;
    }

    return hash;
  },

  findRecord(store, type, id) {
    let url = `${this.get('host')}/build/${id}`;
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then((data) => {
        Ember.run(null, resolve, data);
      }, (jqXHR) => {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  query(store, type, query) {
    let { repository_id, event_type, page_size, offset, sort_by } = query;
    let eventType;
    if (Array.isArray(event_type)) {
      eventType = event_type.join(',');
    } else {
      eventType = event_type;
    }
    // eslint-disable-next-line
    let url = `${this.get('host')}/repo/${repository_id}/builds?event_type=${eventType}&include=build.commit,build.branch`;
    if (page_size) {
      url += `&limit=${page_size}`;
    }
    if (offset) {
      url += `&offset=${offset}`;
    }
    if (sort_by) {
      url += `&sort_by=${sort_by}`;
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(url, this.ajaxOptions()).then((data) => {
        Ember.run(null, resolve, data);
      }, (jqXHR) => {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  pathForType: function (modelName, id) {
    const underscored = Ember.String.underscore(modelName);
    return id ? underscored : Ember.String.pluralize(underscored);
  }
});
