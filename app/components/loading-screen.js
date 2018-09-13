import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  classNames: ['loading-screen'],
  classNameBindings: [
    'center:loading-screen--centered',
    'margin:loading-screen--with-margins'
  ],

  @service randomLogo: null,

  center: false,
  margin: false
});
