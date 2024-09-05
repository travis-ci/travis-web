import Component from '@ember/component';
import { computed } from '@ember/object';
import jobConfigArch from 'travis/utils/job-config-arch';
import jobConfigLanguage from 'travis/utils/job-config-language';
import { reads, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';

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

  job: computed('isJob', 'item', 'item.jobs.firstObject', function () {
    if (this.isJob) {
      return this.item;
    } else {
      return this.get('item.jobs.firstObject');
    }
  }),

  isPremiumVM: computed('job', 'isJob', function () {
    if (this.isJob) return Boolean(this.job.vmSize);
    let jobs = this.get('item.jobs');

    if (jobs && jobs.length == 1) {
      return Boolean(jobs.firstObject.vmSize);
    }
    return false;
  }),

  vmSize: computed('job', 'isJob', function () {
    if (this.isJob) return this.job.vmSize;

    let jobs = this.get('item.jobs');
    if (jobs && jobs.length == 1) {
      return jobs.firstObject.vmSize;
    }

    return '';
  }),

  jobsConfig: reads('job.config'),

  displayCompare: computed('item.eventType', function () {
    let eventType = this.get('item.eventType');
    return !['api', 'cron', 'release'].includes(eventType);
  }),


  commitUrl: computed('item.repo.{ownerName,vcsName,vcsType,slug}', 'commit.sha', function () {
    const owner = this.get('repo.ownerName');
    const repo = this.get('repo.vcsName');
    const vcsType = this.get('repo.vcsType');
    const vcsId = this.get('repo.vcsId');
    const commit = this.get('commit.sha');
    const slugOwner = this.get('repo.slug')?.split('/')[0];

    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit, vcsId, slugOwner });
  }),

  branchUrl: computed('item.repo.{ownerName,vcsName,vcsType,slug}', 'build.branchName', 'commit.sha', function () {
    const owner = this.get('item.repo.ownerName');
    const repo = this.get('item.repo.vcsName');
    const vcsType = this.get('item.repo.vcsType');
    const vcsId = this.get('item.repo.vcsId');
    const branch = this.get('build.branchName');
    const slugOwner = this.get('item.repo.slug').split('/')[0];
    const repoType = this.get('item.repo.serverType');
    const commit = this.get('commit.sha');

    return this.externalLinks.branchUrl(vcsType, repoType, { owner, repo, branch, vcsId, slugOwner, commit });
  }),

  tagUrl: computed('item.repo.{ownerName,vcsName,vcsType,slug}', 'build.tag.name', function () {
    const owner = this.get('item.repo.ownerName');
    const repo = this.get('item.repo.vcsName');
    const vcsType = this.get('item.repo.vcsType');
    const vcsId = this.get('item.repo.vcsId');
    const tag = this.get('build.tag.name');
    const slugOwner = this.get('item.repo.slug').split('/')[0];

    return this.externalLinks.tagUrl(vcsType, { owner, repo, tag, vcsId, slugOwner });
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

  serverTypeIcon: reads('item.repo.serverType'),

  serverType: computed('item.repo.serverType', function () {
    let serverType = this.get('item.repo.serverType');
    if (!serverType) return '';
    if (serverType === 'svn') {
      return 'SVN';
    } else {
      return capitalize(serverType);
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

  globalEnv: reads('build.request.config.env.global'),
  jobEnv: reads('jobsConfig.content.env'),
  gemfile: reads('jobsConfig.content.gemfile'),

  environment: computed('globalEnv', 'jobEnv', 'gemfile', function () {
    if (this.jobEnv) {
      let globalEnv = this.globalEnv || [];
      let join = (vars, pair) => vars.concat([pair.join('=')]);
      let vars = globalEnv.reduce((vars, obj) => Object.entries(obj).reduce(join, vars), []);
      return vars.reduce((env, str) => env.replace(str, ''), this.jobEnv);
    } else if (this.gemfile) {
      return `Gemfile: ${this.gemfile}`;
    }
  }),

  os: reads('job.os'),
  osVersion: reads('job.osVersion'),

  arch: computed('jobsConfig.content.arch', function () {
    let config = this.get('jobsConfig.content');
    return jobConfigArch(config);
  }),

  osIcon: computed('os', function () {
    let os = this.os;
    if (os === 'linux') {
      return 'icon-linux';
    } else if (os === 'freebsd') {
      return 'icon-freebsd';
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

  envExpanded: false,

  isNewBranchBuild: computed('item.commit.compareUrl', function () {
    const url = this.get('item.commit.compareUrl');
    const path = (url || '').split('/').pop();
    return path !== '' && path.indexOf('...') < 0;
  }),

  actions: {
    closeEnv() {
      this.set('envExpanded', false);
    },
    expandEnv() {
      this.set('envExpanded', true);
    },
    toggleEnv() {
      this.set('envExpanded', !this.envExpanded);
    }
  }
});
