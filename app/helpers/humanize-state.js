import Ember from 'ember';

export default Ember.Helper.helper(params => {
  const state = params[0];
  if (state === 'received') {
    return 'booting';
  } else {
    return state;
  }
});
