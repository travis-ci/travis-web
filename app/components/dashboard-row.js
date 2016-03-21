import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import config from 'travis/config/environment';

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
