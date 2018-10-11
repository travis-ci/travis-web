import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import jobConfigLanguage from 'travis/utils/job-config-language';
import { not } from 'ember-decorators/object/computed';


export default Component.extend({
  @service externalLinks: null,

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

  @computed('item.build')
  isJob(build) {
    if (build) {
      return true;
    }
    return false;
  },

  @computed('isJob')
  build(isJob) {
    if (isJob) {
      return this.get('item.build');
    } else {
      return this.get('item');
    }
  },

  @computed('isJob', 'item.config', 'item.jobs.firstObject.config')
  jobsConfig(isJob) {
    if (isJob) {
      return this.get('item.config');
    } else {
      return this.get('item.jobs.firstObject.config');
    }
  },

  @computed('item.eventType')
  displayCompare(eventType) {
    return !['api', 'cron'].includes(eventType);
  },

  @computed('item.repo.slug', 'build.branchName')
  urlGitHubBranch(slug, branchName) {
    return this.get('externalLinks').githubBranch(slug, branchName);
  },

  @computed('item.repo.slug', 'build.tag.name')
  urlGitHubTag(slug, tag) {
    return this.get('externalLinks').githubTag(slug, tag);
  },

  @computed('item.jobs.firstObject.state', 'item.state', 'item.isMatrix')
  buildState(jobState, buildState, isMatrix) {
    if (isMatrix) {
      return buildState;
    } else {
      return jobState || buildState;
    }
  },

  @computed('jobsConfig.content')
  languages(config) {
    return jobConfigLanguage(config);
  },

  @computed('jobsConfig.content.name')
  name(name) {
    if (name) {
      return name;
    }
  },

  @computed('jobsConfig.content.{env,gemfile}')
  environment(env, gemfile) {
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  },

  @computed('jobsConfig.content.os')
  os(os) {
    if (os === 'linux' || os === 'linux-ppc64le') {
      return 'linux';
    } else if (os === 'osx') {
      return 'osx';
    } else if (os === 'windows') {
      return 'windows';
    } else {
      return 'unknown';
    }
  },

  @computed('os')
  osIcon(os) {
    if (os === 'linux') {
      return 'icon-linux';
    } else if (os === 'osx') {
      return 'icon-mac';
    } else if (os === 'windows') {
      return 'icon-windows';
    }  else {
      return 'help';
    }
  },

  @computed('item.commit.body')
  commitBody(body) {
    this.$('commit-description').remove('fade-commit-message');

    if (body.length > 72) {
      this.$('.commit-description').addClass('fade-commit-message');
    }
  },

  @not('item.isMatrix') isNotMatrix: null,

  actions: {
    expandEnv() {
      if (this.$('.expandEnv').css('white-space') === 'normal') {
        this.$('.detail-job-env').removeClass('expandEnv');
        this.$('.detail-job-env').addClass('closeEnv');
      } else {
        this.$('.detail-job-env').removeClass('closeEnv');
        this.$('.detail-job-env').addClass('expandEnv');
      }
    }
  }
});
