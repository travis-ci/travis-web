import Ember from 'ember';
import V2FallbackSerializer from 'travis/serializers/v2_fallback';

export default V2FallbackSerializer.extend({
  normalize(modelClass, resourceHash) {
    if(resourceHash.author && resourceHash.author.name) {
      resourceHash.author_name = resourceHash.author.name;
      resourceHash.author_avatar_url = resourceHash.author.avatar_url;
    }
    if(resourceHash.committer && resourceHash.committer.name) {
      resourceHash.committer_name = resourceHash.author.name;
      resourceHash.committer_avatar_url  = resourceHash.author.avatar_url;
    }
    return this._super(...arguments);
  }
});
