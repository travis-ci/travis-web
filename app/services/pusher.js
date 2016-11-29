import { Service } from 'ember';
import config from 'travis/config/environment';

let service;

const NullService = Service.extend({
  subscribe() {}
});

const PusherService = Service.extend({
  subscribe() {}
});

if (config.pusher.key) {
  service = PusherService;
} else {
  service = NullService;
}

export default service;
