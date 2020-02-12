import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, not } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  auth: service(),
  features: service(),

  isNoDashboard: not('features.dashboard'),
  showSidebar: and('auth.signedIn', 'isNoDashboard'),
  hideSidebar: not('showSidebar'),
});
