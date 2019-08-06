import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  externalLinks: service(),

  isLoading: false,

  vcsProfileUrl: computed('model.{login,vcsType}', function () {
    const login = this.get('model.login');
    const vcsType = this.get('model.vcsType');

    return this.externalLinks.profileUrl(vcsType, login);
  }),

  owner: reads('model'),
});
