import Ember from 'ember';
import jobConfigLanguage from 'travis/utils/job-config-language';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  languages: Ember.computed('job.config', function () {
    return jobConfigLanguage(this.get('job.config'));
  }),

  environment: Ember.computed('job.config.env', 'job.config.gemfile', function () {
    let env = this.get('job.config.env');
    let gemfile = this.get('job.config.gemfile');
    if (env) {
      return env;
    } else if (gemfile) {
      return `Gemfile: ${gemfile}`;
    }
  })
});
