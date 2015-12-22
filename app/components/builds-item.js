import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  urlGithubCommit: function() {
    return githubCommitUrl(this.get('build.repo.slug'), this.get('build.commit.sha'));
  }.property('build.commit.sha')
});
