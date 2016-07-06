import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object, request) {
    const response = object.attrs;

    if (object.commit) {
      response.commit = this.serializerFor('commit').serialize(object.commit, request);
    }

    return response;
  }
});
