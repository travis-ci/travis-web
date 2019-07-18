import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

import vcsLinks from 'travis/utils/vcs-links';

export default Controller.extend({
  isLoading: false,

  vcsProfileUrl: computed('model.{login,vcsType}', function () {
    const login = this.get('model.login');
    const vcsType = this.get('model.vcsType');

    return vcsLinks.profileUrl(vcsType, login);
  }),

  owner: reads('model'),
});
