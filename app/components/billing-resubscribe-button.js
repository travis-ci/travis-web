import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  isActiveGithubSubscription: reads('githubSubscription.isSubscribed'),
});
