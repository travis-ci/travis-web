import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  routing: Ember.inject.service('-routing'),
  tagName: 'li',
  classNameBindings: ['build.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('build.repository.slug'), this.get('build.last_build.commit.sha'));
  }.property('build.last_build'),

  getLast5Builds: function() {
    var apiEndpoint, branchName, lastBuilds, options, repoId;
    lastBuilds = Ember.ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    if (!this.get('build.last_build')) {
      lastBuilds.set('isLoading', false);
    } else {
      apiEndpoint = config.apiEndpoint;
      repoId = this.get('build.repository.id');
      branchName = this.get('build.name');
      options = {};
      if (this.get('auth.signedIn')) {
        options.headers = {
          Authorization: "token " + (this.auth.token())
        };
      }
      $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/builds?branch.name=" + branchName + "&limit=5&build.event_type=push,api", options).then(function(response) {
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
    var permissions;
    if (!this.get('auth.signedIn')) {
      return false;
    } else {
      permissions = this.get('auth.currentUser.permissions');
      if (permissions.contains(parseInt(this.get('build.repository.id')))) {
        return true;
      } else {
        return false;
      }
    }
  }.property(),

  triggerBuild: function() {
    var apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.get('build.repository.id');
    options = {
      type: 'POST',
      body: {
        request: {
          branch: this.get('build.name')
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
