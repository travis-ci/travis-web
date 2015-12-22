import { githubCommit, githubPullRequest } from 'travis/utils/urls';

export default Ember.Mixin.create({
  urlGithubCommit: function() {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }.property('repo.slug', 'commit.sha'),

  urlGithubPullRequest: function() {
    return githubPullRequest(this.get('repo.slug'), this.get('build.pullRequestNumber'));
  }.property('repo.slug', 'build.pullRequestNumber')
});
