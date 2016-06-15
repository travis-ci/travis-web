import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object, request) {
    const response = object.attrs;

    if (object.committer) {
      response.committer = object.committer.attrs
    }

    return response;
  }
});
