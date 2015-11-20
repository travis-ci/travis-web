import Ember from 'ember';

let KeyboardService = Ember.Service.extend({
  bind(keyName, scope, callback) {
    key(...arguments);
  },

  setScope(scope) {
    key.setScope(scope);
  }
});

export default KeyboardService;
