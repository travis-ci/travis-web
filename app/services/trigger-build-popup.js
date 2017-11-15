import Service, { inject as service } from '@ember/service';

export default Service.extend({
  auth: service(),
  isShowingTriggerBuildModal: false,

  toggleTriggerBuildModal() {
    this.toggleProperty('isShowingTriggerBuildModal');
  }
});
