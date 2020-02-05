import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),
  features: service(),

  provider: 'github', // Eventually get this from a service

  showGithub: equal('provider', 'github'),
  showBitbucket: equal('provider', 'bitbucket'),
  showAssembla: equal('provider', 'assembla'),
});
