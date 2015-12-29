import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';
import { languageConfigKeys } from 'travis/utils/keys-map';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['job.state'],
  classNames: ['jobs-item'],

  languages: function() {
    var config, gemfile, key, languageName, output, version;
    output = [];
    if (config = this.get('job.config')) {
      for (key in languageConfigKeys) {
        languageName = languageConfigKeys[key];
        if (version = config[key]) {
          output.push(languageName + ': ' + version);
        }
      }
      gemfile = this.get('job.config.gemfile');
      if (gemfile && this.get('job.config.env')) {
        output.push("Gemfile: " + gemfile);
      }
    }
    return output.join(' ');
  }.property('job.config'),

  environment: function() {
    var env, gemfile;
    if (env = this.get('job.config.env')) {
      return env;
    } else if (gemfile = this.get('job.config.gemfile')) {
      return "Gemfile: " + gemfile;
    }
  }.property('job.config.env', 'job.config.gemfile')
});
