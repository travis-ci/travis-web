import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),
  tagName: 'li',
  classNameBindings: ['lastBuild.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('branch.repository.slug'), this.get('lastBuild.commit.sha'));
  }.property('lastBuild'),

  hasBuilds: function() {
    return this.get('branch.last_build') || this.get('getLast5Builds').count > 0;
  }.property('branch.last_build', 'getLast5Builds'),

  getLast5Builds: function() {
    var apiEndpoint, branchName, lastBuilds, options, repoId;
    lastBuilds = Ember.ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    apiEndpoint = config.apiEndpoint;
    repoId = this.get('branch.repository.id');
    branchName = this.get('branch.name');
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/builds?branch.name=" + branchName + "&limit=5&build.event_type=push,api&include=commit.committer", options).then(function(response) {
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
    return lastBuilds;
  }.property(),

  lastBuild: function() {
    return Ember.ObjectProxy.create({
      content: this.get('getLast5Builds').toArray()[0],
      isLoading: this.get('getLast5Builds.isLoading')
    });
  }.property('getLast5Builds', 'getLast5Builds.isLoading'),

  canTrigger: function() {
    var permissions;
    if (!this.get('auth.signedIn')) {
      return false;
    } else {
      permissions = this.get('auth.currentUser.permissions');
      if (permissions.contains(parseInt(this.get('branch.repository.id')))) {
        return true;
      } else {
        return false;
      }
    }
  }.property(),

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
