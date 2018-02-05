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

  @computed('job.config.content.{env,gemfile}')
  environment(env, gemfile) {
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  },

  @computed('job.config.os')
  os(os) {
    if (os === 'linux') {
      return 'linux';
    } else if (os === 'osx') {
      return 'osx';
    } else {
      return 'unknown';
    }
  }
});
