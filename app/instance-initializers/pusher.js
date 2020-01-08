import config from 'travis/config/environment';
import TravisPusher from 'travis/utils/pusher';
import PusherStub from 'travis/utils/fastboot/stubs/pusher';
import isFastboot from 'travis/utils/fastboot/isFastboot';

export function initialize(applicationInstance) {
  const app = applicationInstance.application;

  const Pusher = isFastboot ? PusherStub : TravisPusher;
  app.pusher = new Pusher(config.pusher, applicationInstance.lookup('service:api'));

  if (!applicationInstance.lookup('pusher:main')) {
    app.register('pusher:main', app.pusher, {
      instantiate: false
    });
  }
  app.inject('route', 'pusher', 'pusher:main');
  app.inject('component', 'pusher', 'pusher:main');
  app.pusher.store = applicationInstance.lookup('service:store');
  app.pusher.pusherService = applicationInstance.lookup('service:pusher');
}

export default {
  name: 'pusher',
  after: 'ember-data',
  initialize,
};
