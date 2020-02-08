import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import TriggerBuild from 'travis/mixins/trigger-build';

export default Controller.extend(TriggerBuild, {
  repo: reads('model'),

  actions: {
    formFieldChanged(field, value) {
      this.set(field, value);
    },
    triggerBuild() {
      if (!this.processing) {
        this.set('processing', true);
        this.submitBuildRequest.perform();
      }
    }
  }
});
