// As suggested here: https://github.com/samselikoff/ember-cli-mirage/issues/265#issuecomment-142059544

import Ember from 'ember';

export default {
  name: 'inflector',
  before: 'ember-cli-mirage',

  initialize: function() {
    const inflector = Ember.Inflector.inflector;
    inflector.uncountable('permissions');
  }
};
