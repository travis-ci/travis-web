import Ember from 'ember';
import { durationFrom } from 'travis/utils/helpers';
import { githubCommit } from 'travis/utils/urls';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['build-header'],
  classNameBindings: ['item.state'],
  attributeBindings: ['jobId:data-job-id'],

  jobId: function() {
    if (this.get('item.build')) {
      return this.get('item.id');
    } else {
      let ids = [];
      let jobs = this.get('item.jobs') || [];
      jobs.forEach(function(item) { ids.push(item.id); });
      return ids.join(' ');
    }
  }.property('item'),

  isJob: function() {
    if (this.get('item.build')) {
      return true;
    } else {
      return false;
    }
  }.property('item'),

  urlGithubCommit: function() {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }.property('item'),

  elapsedTime: function() {
    return durationFrom(this.get('item.startedAt'), this.get('item.finishedAt'));
  }.property('item.startedAt', 'item.finishedAt', 'item.duration')
});
