import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import jobConfigArch from 'travis/utils/job-config-arch';
import jobConfigLanguage from 'travis/utils/job-config-language';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  languages: computed('job.config.content', function () {
    let config = this.get('job.config.content');
    return jobConfigLanguage(config);
  }),

  name: computed('job.config.content.name', function () {
    let name = this.get('job.config.content.name');
    if (name) {
      return name;
    }
  }),

  globalEnv: reads('build.request.config.env.global'),
  jobEnv: reads('job.config.content.env'),
  gemfile: reads('job.config.content.gemfile'),

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

  os: computed('job.config.content.os', function () {
    let os = this.get('job.config.content.os');

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

  osIcon: computed('os', function () {
    let os = this.os;

    if (os === 'linux') {
      return 'icon-linux';
    } else if (os === 'osx') {
      return 'icon-mac';
    } else if (os === 'windows') {
      return 'icon-windows';
    } else {
      return 'help';
    }
  }),

  arch: computed('job.config.content.arch', function () {
    let config = this.get('job.config.content');
    return jobConfigArch(config);
  })
});
