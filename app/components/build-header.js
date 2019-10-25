import Component from '@ember/component';
import { computed } from '@ember/object';
import jobConfigArch from 'travis/utils/job-config-arch';
import jobConfigLanguage from 'travis/utils/job-config-language';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const commitMessageLimit = 72;

export default Component.extend({
  externalLinks: service(),

  tagName: 'section',
  classNames: ['build-header'],
  classNameBindings: ['item.state'],
  attributeBindings: ['jobId:data-job-id'],

  jobId: computed('item.{build,id,jobs}', function () {
    let build = this.get('item.build');
    let id = this.get('item.id');
    let jobs = this.get('item.jobs');
    if (build) {
      return id;
    } else {
      let ids = [];
      jobs = jobs || [];
      jobs.forEach(item => { ids.push(item.id); });
      return ids.join(' ');
    }
  }),

  isJob: computed('item.build', function () {
    let build = this.get('item.build');
    if (build) {
      return true;
    }
    return false;
  }),

  build: computed('isJob', function () {
    let isJob = this.isJob;
    if (isJob) {
      return this.get('item.build');
    } else {
      return this.item;
    }
  }),

  jobsConfig: computed('isJob', 'item.config', 'item.jobs.firstObject.config', function () {
    let isJob = this.isJob;
    if (isJob) {
      return this.get('item.config');
    } else {
      return this.get('item.jobs.firstObject.config');
    }
  }),

  displayCompare: computed('item.eventType', function () {
    let eventType = this.get('item.eventType');
    return !['api', 'cron'].includes(eventType);
  }),

  commitUrl: computed('item.repo.{slug,vcsType}', 'commit.sha', function () {
    const [owner, repo] = this.get('item.repo.slug').split('/');
    const vcsType = this.get('item.repo.vcsType');
    const commit = this.get('commit.sha');

    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit });
  }),

  branchUrl: computed('item.repo.{slug,vcsType}', 'build.branchName', function () {
    const [owner, repo] = this.get('item.repo.slug').split('/');
    const vcsType = this.get('item.repo.vcsType');
    const branch = this.get('build.branchName');

    return this.externalLinks.branchUrl(vcsType, { owner, repo, branch });
  }),

  tagUrl: computed('item.repo.{slug,vcsType}', 'build.tag.name', function () {
    const [owner, repo] = this.get('item.repo.slug').split('/');
    const vcsType = this.get('item.repo.vcsType');
    const tag = this.get('build.tag.name');

    return this.externalLinks.tagUrl(vcsType, { owner, repo, tag });
  }),

  buildState: computed('item.jobs.firstObject.state', 'item.state', 'item.isMatrix', function () {
    let jobState = this.get('item.jobs.firstObject.state');
    let buildState = this.get('item.state');
    let isMatrix = this.get('item.isMatrix');
    if (isMatrix) {
      return buildState;
    } else {
      return jobState || buildState;
    }
  }),

  languages: computed('jobsConfig.content', function () {
    let config = this.get('jobsConfig.content');
    return jobConfigLanguage(config);
  }),

  name: computed('jobsConfig.content.name', function () {
    let name = this.get('jobsConfig.content.name');
    if (name) {
      return name;
    }
  }),

  environment: computed('jobsConfig.content.{env,gemfile}', function () {
    let env = this.get('jobsConfig.content.env');
    let gemfile = this.get('jobsConfig.content.gemfile');
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  }),

  os: computed('jobsConfig.content.os', function () {
    let os = this.get('jobsConfig.content.os');
    if (os === 'linux' || os === 'linux-ppc64le') {
      return 'linux';
    } else if (os === 'osx') {
      return 'osx';
    } else if (os === 'windows') {
      return 'windows';
    } else {
      return 'unknown';
    }
  }),

  arch: computed('jobsConfig.content.arch', function () {
    let config = this.get('jobsConfig.content');
    return jobConfigArch(config);
  }),

  osIcon: computed('os', function () {
    let os = this.os;
    if (os === 'linux') {
      return 'icon-linux';
    } else if (os === 'osx') {
      return 'icon-mac';
    } else if (os === 'windows') {
      return 'icon-windows';
    }  else {
      return 'help';
    }
  }),

  commitBodyClass: computed('item.commit.body', function () {
    let body = this.get('item.commit.body');
    return body.length > commitMessageLimit ? 'fade-commit-message' : '';
  }),

  isNotMatrix: not('item.isMatrix'),

  actions: {
    expandEnv() {
      const expandedStyles = getComputedStyle(this.element.querySelector('.expandEnv'));
      const detailJobEnv = this.element.querySelector('.detail-job-env');
      if (expandedStyles && expandedStyles['white-space'] === 'normal') {
        detailJobEnv.classList.remove('expandEnv');
        detailJobEnv.classList.add('closeEnv');
      } else {
        detailJobEnv.classList.remove('closeEnv');
        detailJobEnv.classList.add('expandEnv');
      }
    }
  }
});
