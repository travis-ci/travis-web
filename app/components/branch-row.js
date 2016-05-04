import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend({
  routing: service('-routing'),
  permissions: service(),

  tagName: 'li',
  classNameBindings: ['branch.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('branch.repository.slug'), this.get('branch.last_build.commit.sha'));
  }.property('branch.last_build'),

  getLast5Builds: function() {
    var apiEndpoint, branchName, lastBuilds, options, repoId;
    lastBuilds = Ember.ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    if (!this.get('branch.last_build')) {
      lastBuilds.set('isLoading', false);
    } else {
      apiEndpoint = config.apiEndpoint;
      repoId = this.get('branch.repository.id');
      branchName = this.get('branch.name');
      options = {};
      if (this.get('auth.signedIn')) {
        options.headers = {
          Authorization: "token " + (this.auth.token())
        };
      }
      $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/builds?branch.name=" + branchName + "&limit=5&build.event_type=push,api,cron", options).then(function(response) {
        var array, i, j, ref;
        array = response.builds.map(function(build) {
          return Ember.Object.create(build);
        });
        if (array.length < 5) {
          for (i = j = 1, ref = 5 - array.length; j <= ref; i = j += 1) {
            array.push({});
          }
        }
        lastBuilds.set('count', response['@pagination'].count);
        lastBuilds.set('content', array);
        return lastBuilds.set('isLoading', false);
      });
    }
    return lastBuilds;
  }.property(),

  canTrigger: function() {
    return this.get('permissions').hasPermission(this.get('branch.repository'));
  }.property('permissions.all', 'build.repository'),

  triggerBuild: function() {
    var apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.get('branch.repository.id');
    options = {
      type: 'POST',
      body: {
        request: {
          branch: this.get('branch.name')
        }
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    return $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/requests", options).then(() => {
      this.set('isTriggering', false);
      return this.set('hasTriggered', true);
    });
  },

  actions: {
    tiggerBuild(branch) {
      this.set('isTriggering', true);
      return this.triggerBuild();
    },

    viewAllBuilds(branch) {
      return this.get('routing').transitionTo('builds');
    }
  }
});
