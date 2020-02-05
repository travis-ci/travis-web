import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { equal, or } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),
  features: service(),

  queryParams: ['provider'],

  // Eventually get provider info from a service. Depends on other PRs in progress
  provider: null,
  defaultProvider: 'github',

  selectedProvider: or('provider', 'defaultProvider'),

  showGithub: equal('selectedProvider', 'github'),
  showBitbucket: equal('selectedProvider', 'bitbucket'),
});
