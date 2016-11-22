import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Mixin.create({
  externalLinks: service(),

  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    const slug = this.get('repo.slug');
    const sha = this.get('commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),

  urlGithubPullRequest: Ember.computed('repo.slug', 'build.pullRequestNumber', function () {
    const slug = this.get('repo.slug');
    const pullRequestNumber = this.get('build.pullRequestNumber');
    return this.get('externalLinks').githubPullRequest(slug, pullRequestNumber);
  })
});
