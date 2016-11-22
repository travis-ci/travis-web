import Ember from 'ember';
import computed from 'ember-computed-decorators';
import { durationFrom } from 'travis/utils/helpers';

const { service } = Ember.inject;

export default Ember.Component.extend({
  externalLinks: service(),

  tagName: 'section',
  classNames: ['build-header'],
  classNameBindings: ['item.state'],
  attributeBindings: ['jobId:data-job-id'],

  @computed('item.{build,id,jobs}')
  jobId(build, id, jobs) {
    if (build) {
      return id;
    } else {
      let ids = [];
      jobs = jobs || [];
      jobs.forEach(item => { ids.push(item.id); });
      return ids.join(' ');
    }
  },

  isJob: Ember.computed('item', function () {
    if (this.get('item.build')) {
      return true;
    } else {
      return false;
    }
  }),

  displayCompare: Ember.computed('item.eventType', function () {
    let eventType = this.get('item.eventType');
    if (eventType === 'api' || eventType === 'cron') {
      return false;
    } else {
      return true;
    }
  }),

  urlGithubCommit: Ember.computed('repo.slug', 'commit.sha', function () {
    const slug = this.get('repo.slug');
    const sha = this.get('commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),

  elapsedTime: Ember.computed('item.startedAt', 'item.finishedAt', 'item.duration', function () {
    return durationFrom(this.get('item.startedAt'), this.get('item.finishedAt'));
  }),

  @computed('item.repo.slug', 'commit.branch')
  urlGitHubBranch(slug, branchName) {
    return this.get('externalLinks').githubBranch(slug, branchName);
  }
});
