import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),

  currentUser: reads('auth.currentUser'),
});
