import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import config from 'travis/config/environment';
import { hasAdminPermission, hasPushPermission } from 'travis/utils/permission';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  permissions: service(),

  tagName: 'li',
  classNameBindings: ['currentBuild.state'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.default_branch.current_build'),

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('repo.slug'), this.get('currentBuild.commit.sha'));
  }.property('repo.slug', 'currentBuild.commit.sha'),

  displayMenuTofu: Ember.computed('permissions.all', 'repo', function() {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  displayActivateLink: Ember.computed('permissions.all', 'repo', function() {
    return this.get('permissions').hasAdminPermission(this.get('repo'));
  }),

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
