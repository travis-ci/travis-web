import Ember from 'ember';
import Tailing from 'travis/utils/tailing';
import ToTop from 'travis/utils/to-top';
let Initializer, initialize;

initialize = application => {
  application.tailing = new Tailing(Ember.$(window), '#tail', '#log');
  return application.toTop = new ToTop(Ember.$(window), '.to-top', '#log-container');
};

Initializer = {
  name: 'services',
  initialize
};

export { initialize };

export default Initializer;
