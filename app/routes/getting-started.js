import TravisRoute from 'travis/routes/basic';
import Ember from 'ember';

export default TravisRoute.extend({
  setupController(controller) {
    return Ember.getOwner(this).lookup('controller:repos').activate('owned');
  }
});
