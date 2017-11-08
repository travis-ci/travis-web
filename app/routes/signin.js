import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

// This route is needed in order to allow signing in with an external link
// to travis-ci.org/signin. I'm not sure if this is the best idea, but it seems
// that we're already using it on some of the landpages, so we need to keep it
// for now.
export default TravisRoute.extend({
  @service auth: null,
  needsAuth: false,

  activate() {
    if (this.auth.get('signedIn')) {
      this.transitionTo('main');
    } else {
      this.auth.signIn();
    }
  }
});
