import config from 'travis/config/environment';
import TravisPusher from 'travis/utils/pusher';

export function initialize(applicationInstance) {
  const app = applicationInstance.application;
  const pusher = new TravisPusher(config.pusher, applicationInstance.lookup('service:api'));

  if (!applicationInstance.lookup('pusher:main')) {
    app.register('pusher:main', pusher, {
      instantiate: false
    });
  }
  pusher.store = applicationInstance.lookup('service:store');
  pusher.pusherService = applicationInstance.lookup('service:pusher');

  // Setting the pusher instance in the application instance for explicit injection later
  applicationInstance.pusher = pusher;
}

export default {
  name: 'pusher',
  after: 'ember-data',
  initialize,
};
