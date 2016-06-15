import { Serializer } from 'ember-cli-mirage';

import CommitSerializer from './commit';

export default Serializer.extend({
  serialize(object, request) {
    const response = object.attrs;

    if (object.commit && object.commit.models.length > 0) {
      // FIXME there should be a hasOne relationship here but I couldn’t get that working…
      const commit = object.commit.models[0];

      if (commit) {
        response.commit = new CommitSerializer().serialize(commit, request);
      }
    }

    return response;
  }
});
