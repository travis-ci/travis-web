import Ember from 'ember';
import { durationFrom } from 'travis/utils/helpers';
import { githubCommit } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['build-header'],
  classNameBindings: ['item.state'],
  attributeBindings: ['jobId:data-job-id'],

  jobId: Ember.computed('item', function () {
    if (this.get('item.build')) {
      return this.get('item.id');
    } else {
      let ids = [];
      let jobs = this.get('item.jobs') || [];
      jobs.forEach(item => { ids.push(item.id); });
      return ids.join(' ');
    }
  }),

  isJob: Ember.computed('item', function () {
    if (this.get('item.build')) {
      return true;
    } else {
      return false;
    }
  }),

  urlGithubCommit: Ember.computed('item', function () {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }),

  elapsedTime: Ember.computed('item.startedAt', 'item.finishedAt', 'item.duration', function () {
    return durationFrom(this.get('item.startedAt'), this.get('item.finishedAt'));
  })
});
