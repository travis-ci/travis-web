import { inject as service } from '@ember/service';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  api: service(),
  needsAuth: false,

  titleToken(model) {
    return model.name;
  },

  model(params, transition) {
    const includes = '?include=user.repositories,organization.repositories,build.commit,repository.active';
    const { owner } = this.paramsFor('owner');
    const url = `/owner/${owner}${includes}`;

    return this.api.get(url);
  }
});
