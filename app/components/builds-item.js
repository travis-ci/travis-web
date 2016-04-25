import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  didInsertElement() {
    this._super(...arguments);
    throw new Error("Error");
  },

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('build.repo.slug'), this.get('build.commit.sha'));
  }.property('build.commit.sha')
});
