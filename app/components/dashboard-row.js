import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import config from 'travis/config/environment';
import Permissions from 'travis/mixins/permissions';

export default Ember.Component.extend(Permissions, {
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
    return this.hasPushPermission(this.get('currentUser'), this.get('repo.id'));
  },

  displayActivateLink: function() {
    return this.hasAdminPermission(this.get('currentUser'), this.get('repo.id'));
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
