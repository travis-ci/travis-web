import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  classNames: ['form--cron'],
  store: Ember.inject.service(),
  default_branch: 'master',

  reset() {
    return this.setProperties({
      branch: null,
      interval: null,
      disable_by_build: null
    });
  },

  actions: {
    save() {
      var cron, self;
      if (this.get('isSaving')) {
        return;
      }
      this.set('isSaving', true);
      cron = this.get('store').createRecord('cron', {
        branchName: this.get('selectedBranch') ? this.get('selectedBranch').name : this.get('default_branch'),
        interval: this.get('selectedInterval') || 'monthly',
        disable_by_build: this.get('disable') || false,
        repo: this.get('repo')
      });
      self = this;
      return cron.save().then(() => {
        this.set('isSaving', false);
        return this.reset();
      }, () => {
         this.set('isSaving', false);
        return this.reset();
      });
    }
  },

  intervals: function() {
    return ['monthly', 'weekly', 'daily'];
  }.property(),

  branches: function() {
    var result, apiEndpoint, options, repoId, context;
    context = this;
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
      context.set('default_branch', response.branches[0].name);
      return result.set('content', response.branches);
    });
    return result;
  }.property('repo')

});
