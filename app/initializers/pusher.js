import config from 'travis/config/environment';
import TravisPusher from 'travis/utils/pusher';
var PusherInitializer, initialize;

initialize = function(application) {
  return null;
};

PusherInitializer = {
  name: 'pusher',
  after: 'ember-data',
  initialize: initialize
};

export {initialize};

export default PusherInitializer;
