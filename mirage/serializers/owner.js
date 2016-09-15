import Ember from 'ember';
import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object) {
    const user = Ember.copy(object.attrs);
    user['@type'] = 'user';

    user.repositories = object._schema.repositories.where((repo) => {
      return repo.slug.indexOf(user.login) === 0;
    }).models;

    return user;
  }
});
