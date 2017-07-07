import Ember from 'ember';
import Tailing from "travis/src/utils/tailing";
import ToTop from "travis/src/utils/to-top";
var Initializer, initialize;

initialize = function (application) {
  application.tailing = new Tailing(Ember.$(window), '#tail', '#log');
  return application.toTop = new ToTop(Ember.$(window), '.to-top', '#log-container');
};

Initializer = {
  name: 'services',
  initialize: initialize
};

export { initialize };

export default Initializer;
