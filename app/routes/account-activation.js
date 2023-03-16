import { inject as service } from '@ember/service';
import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({
  auth: service(),
  accounts: service(),
  router: service(),
  features: service(),
  stripe: service(),
  storage: service(),
  wizardStateService: service('wizard-state'),

  activate() {
    this.storage.wizardStep = 1;
    this.wizardStateService.update.perform(1);
  },

  deactivate() {
    let step = this.storage.wizardStep;
    if (step == 2 || step == 3) this.transitionTo('/account/repositories');
  },

  title: 'Travis CI - Select Plan',

  beforeModel() {
    return this.stripe.load();
  },
  model() {
    this.wizardStateService.fetch.perform();
    this.accounts.user.fetchV2Plans.perform();
    return this.accounts.user;
  }

});
