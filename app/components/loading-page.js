import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { not } from '@ember/object/computed';

export default Component.extend({
  auth: service(),

  showHeader: not('auth.signingIn')
});
