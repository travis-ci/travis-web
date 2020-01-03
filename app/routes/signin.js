import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),
  headData: service(),

  needsAuth: false,

  beforeModel() {
    if (this.get('auth.signedIn')) {
      this.transitionTo('index');
    }
  },

  activate: function () {
    this.set('headData.useTailwindBase', true);
    return this._super(...arguments);
  },

  deactivate() {
    this.set('headData.useTailwindBase', false);
    return this._super(...arguments);
  },
});
