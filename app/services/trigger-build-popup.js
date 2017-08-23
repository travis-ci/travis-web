import Ember from 'ember';

let { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),
  isShowingTriggerBuildModal: false,

  toggleTriggerBuildModal() {
    this.toggleProperty('isShowingTriggerBuildModal');
  }
});
