import Ember from 'ember';

export default Ember.Helper.helper((params) => {
  let [state] = params;
  if (state === 'received') {
    return 'booting';
  }
  return state;
});
