import Ember from 'ember';

export const helper = Ember.Helper.helper(function (params) {
  var state = params[0];
  if (state === 'received') {
    return 'booting';
  } else {
    return state;
  }
});
