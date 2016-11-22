import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';

const { service } = Ember.inject;

export default Ember.Component.extend({
  urls: service(),

  pollModels: 'job.build',

  color: Ember.computed('job.state', function () {
    return colorForState(this.get('job.state'));
  }),

  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    const slug = this.get('repo.slug');
    const sha = this.get('commit.sha');
    return this.get('urls').githubCommit(slug, sha);
  })
});
