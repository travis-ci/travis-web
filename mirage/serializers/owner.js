import Ember from 'ember';
import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object) {
    const user = Ember.copy(object.attrs);
    user['@type'] = 'user';

    user.repositories = object._schema.repositories.where(repo => {
      return repo.slug.indexOf(user.login) === 0;
    }).models.map(repo => {
      const data = Ember.copy(repo.attrs);

      const defaultBranch = repo.branches.models.filterBy('default_branch', true)[0];

      if (defaultBranch) {
        data.default_branch = defaultBranch.attrs;
        data.default_branch.last_build = defaultBranch.builds.models[0].attrs;
      }

      return data;
    });

    return user;
  }
});
