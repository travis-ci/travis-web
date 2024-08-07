import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { docs, languages, quickStart } = config.urls;


export default Component.extend({
  accounts: service(),
  store: service(),
  storage: service(),
  wizard: service('wizard-state'),

  account: null,
  wizardStep: null,
  showWizard: null,
  onClose: null,
  travisDocsUrl: computed(() => `${docs}`),
  travisBasicLanguageExamplesUrl: computed(() => `${languages}`),
  travisQuickStartUrl: computed(() => `${quickStart}`),

  updateStep: task(function* (val) {
    let step = parseInt(this.wizardStep) + val;
    this.set('wizardStep', step);
    this.storage.wizardStep = step;
    yield this.wizard.update.perform(step);
  }).drop(),

  actions: {
    nextStep() {
      this.updateStep.perform(1);
      if (this.wizardStep > 3) this.get('onClose')();
    },
    previousStep() {
      this.updateStep.perform(-1);
    }
  }
});
