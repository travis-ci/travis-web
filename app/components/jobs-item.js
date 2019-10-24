import Component from '@ember/component';
import { computed } from '@ember/object';
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

  environment: computed('job.config.content.{env,gemfile}', function () {
    let env = this.get('job.config.content.env');
    let gemfile = this.get('job.config.content.gemfile');

    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
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
