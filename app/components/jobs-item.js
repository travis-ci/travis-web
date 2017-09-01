import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import jobConfigLanguage from 'travis/utils/job-config-language';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  @computed('job.config')
  languages(config) {
    return jobConfigLanguage(config);
  },

  @computed('job.config.{env,gemfile}')
  environment(env, gemfile) {
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  },
});
