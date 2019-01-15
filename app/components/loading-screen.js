import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['loading-screen'],
  classNameBindings: [
    'center:loading-screen--centered',
    'margin:loading-screen--with-margins'
  ],

  randomLogo: service(),

  center: false,
  margin: false
});
