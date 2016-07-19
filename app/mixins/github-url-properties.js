import { githubCommit, githubPullRequest } from 'travis/utils/urls';
import Ember from 'ember';

export default Ember.Mixin.create({
  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }),

  urlGithubPullRequest: Ember.computed('repo.slug', 'build.pullRequestNumber', function () {
    return githubPullRequest(this.get('repo.slug'), this.get('build.pullRequestNumber'));
  })
});
