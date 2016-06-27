import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import config from 'travis/config/environment';
import { hasAdminPermission, hasPushPermission } from 'travis/utils/permission';

const { service } = Ember.inject;

export default Ember.Component.extend({
  permissions: service(),
  tagName: 'li',
  classNameBindings: ['repo.default_branch.last_build.state', 'repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,
  dropupIsOpen: false,

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('repo.slug'), this.get('repo.default_branch.last_build.commit.sha'));
  }.property('repo'),

  displayMenuTofu: Ember.computed('permissions.all', 'repo', function() {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  displayActivateLink: Ember.computed('permissions.all', 'repo', function() {
    return this.get('permissions').hasAdminPermission(this.get('repo'));
  }),

  openDropup: function() {
    var self = this;
    this.toggleProperty('dropupIsOpen');
    Ember.run.later((function() { self.toggleProperty('dropupIsOpen'); }), 2000);
  },

  actions: {
    tiggerBuild(branch) {
      this.set('isTriggering', true);
      return this.triggerBuild();
    },
    openDropup() {
      this.openDropup();
    }
  }
});
