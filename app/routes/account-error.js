import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, error) {
    const { message } = error;
    let matches = message.match(/\/owner\/(.*)\/repos/);
    if (matches) {
      const [, account] = matches;
      controller.set('account', account);
    }
    return this._super(...arguments);
  },
});
