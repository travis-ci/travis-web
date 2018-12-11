import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  features: service(),
});
