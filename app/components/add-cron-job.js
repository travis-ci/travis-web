import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  classNames: ['form--cron'],
  classNameBindings: ['nameIsBlank:form-error'],
  store: Ember.inject.service(),

  isValid() {
    if (Ember.isBlank(this.get('name'))) {
      this.set('nameIsBlank', true);
      return false;
    } else {
      return true;
    }
  },

  reset() {
    return this.setProperties({
      branch: null,
      interval: null,
      "disable_by_build": null
    });
  },

  actions: {
    save() {
      var env_var, self;
      if (this.get('isSaving')) {
        return;
      }
      this.set('isSaving', true);
      if (this.isValid()) {
        env_var = this.get('store').createRecord('env_var', {
          name: this.get('name'),
          value: this.get('value'),
          "public": this.get('public'),
          repo: this.get('repo')
        });
        self = this;
        return env_var.save().then(() => {
          this.set('isSaving', false);
          return this.reset();
        }, () => {
          return this.set('isSaving', false);
        });
      } else {
        return this.set('isSaving', false);
      }
    },

    nameChanged() {
      return this.set('nameIsBlank', false);
    }
  },

  intervals: function() {
    return ['monthly', 'weekly', 'daily'];
  }.property(),

  branches: function() {
    var result, apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.get('repo.id');
    result = Ember.ArrayProxy.create();
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/branches?exists_on_github=true&sort_by=default_branch,name", options).then(function(response) {
      result.set('count', response['@pagination'].count);
      return result.set('content', response.branches);
    });
    return result;
  }.property('repo')

});
