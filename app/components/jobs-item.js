import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import jobConfigLanguage from 'travis/utils/job-config-language';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  @computed('job.config.content')
  languages(config) {
    return jobConfigLanguage(config);
  },

  @computed('job.config.content.name')
  name(name) {
    if (name) {
      return name;
    }
  },

  @computed('job.config.content.{env,gemfile}')
  environment(env, gemfile) {
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  },

  @computed('job.config.content.os')
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
    } else {
      return 'help';
    }
  }
});
