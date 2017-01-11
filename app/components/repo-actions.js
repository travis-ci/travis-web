import Ember from 'ember';
import RepoActionsItemComponentMixin from 'travis/mixins/repo-actions-item-component-mixin';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend(RepoActionsItemComponentMixin, {
  classNames: ['repo-main-tools'],
  classNameBindings: ['small'],

  @computed('type', 'job', 'build')
  item(type, job, build) {
    if (type === 'job') {
      return job;
    } else {
      return build;
    }
  },

  @computed('job', 'build')
  type(job) {
    if (job) {
      return 'job';
    } else {
      return 'build';
    }
  }
});
