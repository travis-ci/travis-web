import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  urlGithubCommit: Ember.computed('build.commit.sha', function () {
    return githubCommitUrl(this.get('build.repo.slug'), this.get('build.commit.sha'));
  })
});
