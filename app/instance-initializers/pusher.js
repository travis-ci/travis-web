import config from 'travis/config/environment';
import TravisPusher from 'travis/utils/pusher';
var PusherInitializer, initialize;

initialize = function(data) {
  var application;
  application = data.application;
  if (config.pusher.key) {
    application.pusher = new TravisPusher(config.pusher, data.container.lookup('service:ajax'));
    application.register('pusher:main', application.pusher, {
      instantiate: false
    });
    application.inject('route', 'pusher', 'pusher:main');
    return application.pusher.store = data.container.lookup('service:store');
  }
};

PusherInitializer = {
  name: 'pusher',
  after: 'ember-data',
  initialize: initialize
};

export {initialize};

export default PusherInitializer;
