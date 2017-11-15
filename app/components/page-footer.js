import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  features: service(),
  tagName: 'footer',
  classNames: ['footer']
});
