import { ActiveModelSerializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

export default ActiveModelSerializer.extend({
  keyForModel(modelName) {
    return underscore(modelName);
  },

  keyForCollection(modelName) {
    return pluralize(underscore(modelName));
  },

  /**
    * This overrides the Serializer implementation because the latter users
    * .serializerFor, which will never choose the V2 serialiser, since it
    * doesn’t have a request to examine.
    */
  _keyForModelOrCollection(modelOrCollection) {
    if (this.isModel(modelOrCollection)) {
      return this.keyForModel(modelOrCollection.modelName);
    } else {
      return this.keyForCollection(modelOrCollection.modelName);
    }
  }
});
