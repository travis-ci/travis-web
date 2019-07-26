import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tabStates: service(),

  noReposMessage: computed('viewingOwned', function () {
    if (this.viewingOwned === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else {
      return 'No repositories found';
    }
  }),
});
