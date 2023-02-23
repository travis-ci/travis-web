import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { or, reads, filterBy } from '@ember/object/computed';
import config from 'travis/config/environment';

const { docs, languages } = config.urls;


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
  showWizard: false,

  updateStep: task(function* (val) {
    let step = parseInt(this.wizardStep) + val;
    this.set('wizardStep', step);
    yield this.wizard.update.perform(step);
    
  }).drop(),

  actions: {
    nextStep() {
      this.updateStep.perform(1);
      if (this.wizardStep > 3) this.get('onClose') ();
    },
    previousStep() {
      this.updateStep.perform(-1);
    }
  }
});
