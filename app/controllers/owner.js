import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  isLoading: false,

  config,

  githubProfile: computed('model.login', function () {
    let login = this.get('model.login');
    const { sourceEndpoint } = config;
    return `${sourceEndpoint}/${login}`;
  }),

  owner: reads('model'),
});
