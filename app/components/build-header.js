import Ember from 'ember';
import computed from 'ember-computed-decorators';
import durationFrom from 'travis/utils/duration-from';

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

  @computed('isJob')
  build(isJob) {
    if (isJob) {
      return this.get('item.build');
    } else {
      return this.get('item');
    }
  },

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

  @computed('item.startedAt', 'item.finishedAt')
  elapsedTime(startedAt, finishedAt) {
    return durationFrom(startedAt, finishedAt);
  },

  @computed('item.repo.slug', 'build.branchName')
  urlGitHubBranch(slug, branchName) {
    return this.get('externalLinks').githubBranch(slug, branchName);
  }
});
