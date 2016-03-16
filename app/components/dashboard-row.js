import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import config from 'travis/config/environment';
import { hasAdminPermission, hasPushPermission } from 'travis/utils/permission';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['repo.default_branch.last_build.state'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,
  dropupIsOpen: false,

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('repo.slug'), this.get('repo.default_branch.last_build.commit.sha'));
  }.property('repo'),

  displayMenuTofu: function() {
    return hasPushPermission(this.get('currentUser'), this.get('repo.id'));
  },

  displayActivateLink: function() {
    return hasAdminPermission(this.get('currentUser'), this.get('repo.id'));
  },

  actions: {
    tiggerBuild(branch) {
      this.set('isTriggering', true);
      return this.triggerBuild();
    },
    openDropup() {
      this.toggleProperty('dropupIsOpen');
    }
  }
});
