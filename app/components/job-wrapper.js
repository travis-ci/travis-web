import Ember from 'ember';
import colorForState from 'travis/utils/color-for-state';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  @service externalLinks: null,

  pollModels: 'job.build',

  @computed('job.state')
  color(jobState) {
    return colorForState(jobState);
  },

  @computed('repo.slug', 'commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  },
});
