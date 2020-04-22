import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { equal, or, reads } from '@ember/object/computed';

export default Controller.extend({
  features: service(),
  multiVcs: service(),

  queryParams: ['provider'],

  provider: 'gitlab', // reads('multiVcs.userSlug'),
  defaultProvider: reads('multiVcs.primaryProvider'),

  selectedProvider: or('provider', 'defaultProvider'),

  showGithub: equal('selectedProvider', 'github'),
  showBitbucket: equal('selectedProvider', 'bitbucket'),
  showGitlab: equal('selectedProvider', 'gitlab'),
});
