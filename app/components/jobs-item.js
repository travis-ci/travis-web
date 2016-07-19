import Ember from 'ember';
import { languageConfigKeys } from 'travis/utils/keys-map';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  languages: Ember.computed('job.config', function () {
    var gemfile, key, languageName, output;
    output = [];
    let config = this.get('job.config');
    if (config) {
      for (key in languageConfigKeys) {
        languageName = languageConfigKeys[key];
        let version = config[key];
        if (version) {
          output.push(languageName + ': ' + version);
        }
      }
      gemfile = this.get('job.config.gemfile');
      if (gemfile && this.get('job.config.env')) {
        output.push('Gemfile: ' + gemfile);
      }
    }
    return output.join(' ');
  }),

  environment: Ember.computed('job.config.env', 'job.config.gemfile', function () {
    let env = this.get('job.config.env');
    let gemfile = this.get('job.config.gemfile');
    if (env) {
      return env;
    } else if (gemfile) {
      return 'Gemfile: ' + gemfile;
    }
  })
});
