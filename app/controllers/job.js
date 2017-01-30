import Ember from 'ember';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  externalLinks: service(),

  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),

  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    const slug = this.get('repo.slug');
    const sha = this.get('commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),

  jobStateDidChange: Ember.observer('job.state', function () {
    return this.send('faviconStateDidChange', this.get('job.state'));
  })
});
