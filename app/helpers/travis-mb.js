import Ember from 'ember';

export default Ember.Helper.helper((size) => {
  if (size) {
    return (size / 1024 / 1024).toFixed(2);
  }
});
