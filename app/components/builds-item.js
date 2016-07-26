import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  classNames: ['row-li', 'pr-row'],

  commit: Ember.computed.alias('build.commit'),
  repo: Ember.computed.alias('build.repo'),
  branch: Ember.computed.alias('build.branch'),

  urlGithubCommit: Ember.computed('commit.sha', 'repo.slug', function () {
    return githubCommitUrl(this.get('repo.slug'), this.get('commit.sha'));
  })
});
