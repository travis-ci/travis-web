import { ActiveModelSerializer } from 'ember-cli-mirage';

import Ember from 'ember';

export default ActiveModelSerializer.extend({
  keyForModel(modelName) {
    return Ember.String.underscore(modelName);
  },

  keyForCollection(modelName) {
    return Ember.String.pluralize(Ember.String.underscore(modelName));
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
