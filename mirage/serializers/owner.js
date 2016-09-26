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

        const lastBuild = defaultBranch.builds.models[0];

        if (lastBuild) {
          data.default_branch.last_build = lastBuild.attrs;
          data.default_branch.last_build.commit = lastBuild.commit.attrs;
        }
      }

      return data;
    });

    return user;
  }
});
