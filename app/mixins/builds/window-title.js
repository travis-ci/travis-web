import Ember from 'ember';

export default Ember.Mixin.create({
  titleToken(/* model*/) {
    return this.get('contentType').replace('_', ' ').capitalize();
  },
});
