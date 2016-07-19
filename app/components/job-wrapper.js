import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';
import { githubCommit } from 'travis/utils/urls';

export default Ember.Component.extend({
  pollModels: 'job.build',

  color: Ember.computed('job.state', function () {
    return colorForState(this.get('job.state'));
  }),

  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  })
});
