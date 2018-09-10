// As suggested here: https://github.com/samselikoff/ember-cli-mirage/issues/265#issuecomment-142059544
import Inflector from 'ember-inflector';

const initializer = {
  name: 'inflector',

  initialize: function () {
    const inflector = Inflector.inflector;
    inflector.uncountable('permissions');
    inflector.irregular('cache', 'caches');
  }
};

export default initializer;
