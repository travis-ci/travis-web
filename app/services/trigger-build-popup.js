import Ember from 'ember';
import config from 'travis/config/environment';

let { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),
  isShowingTriggerBuildModal: false,

  toggleTriggerBuildModal() {
    this.toggleProperty('isShowingTriggerBuildModal');
  }
});
