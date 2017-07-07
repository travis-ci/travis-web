// As suggested here: https://github.com/samselikoff/ember-cli-mirage/issues/265#issuecomment-142059544

import Ember from 'ember';
import config from 'travis/config/environment';

const initializer = {
  name: 'inflector',

  initialize: function () {
    const inflector = Ember.Inflector.inflector;
    inflector.uncountable('permissions');
    inflector.irregular('cache', 'caches');
  }
};

if (config.environment !== 'production') {
  initializer.before = 'ember-cli-mirage';
}

export default initializer;
