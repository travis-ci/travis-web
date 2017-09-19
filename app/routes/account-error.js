import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, error) {
    const { message } = error;
    const [, account] = message.match(/\/owner\/(.*)\/repos/);
    controller.set('account', account);
    return this._super(...arguments);
  },
});
