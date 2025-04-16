import Pusher from 'pusher-js';

import { next } from '@ember/runloop';

let TravisPusher = function (config, apiService) {
  this.active_channels = [];
  this.init(config, apiService);
  TravisPusher.apiService = apiService;
  return this;
};

TravisPusher.prototype.init = function (config, apiService) {
  if (!config.key) {
    // Set up a mock Pusher that ignores the expected methods.
    return this.pusher = {
      subscribe() {
        return {
          bind_global() {}
        };
      },
      unsubscribe() {},
      channel() {}
    };
  }

  this.apiService = apiService;
  Pusher.warn = this.warn.bind(this);

  if (config.debug) {
    Pusher.log = function (message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };
  }

  let pusherConfig = {
    enabledTransports: ['ws'],
    encrypted: config.encrypted,
    disableStats: true,
    wsHost: config.host,

    authorizer: function (channel, options) {
      return {
        authorize: function (socketId, callback) {
          let channelName = channel.name;

          TravisPusher.apiService.post('/pusher/auth', {
            travisApiVersion: null,
            data: {
              socket_id: socketId,
              channels: [channelName]
            }
          }).then((data) => {
            callback(false, { auth: data['channels'][channelName] });
          });
        }
      };
    }
  };

  if (config.path) {
    pusherConfig.wsPath = `/${config.path}`;
  }

  return this.pusher = new Pusher(config.key, pusherConfig);
};

TravisPusher.prototype.subscribeAll = function (channels) {
  let channel, i, len, results;
  results = [];
  for (i = 0, len = channels.length; i < len; i++) {
    channel = channels[i];
    results.push(this.subscribe(channel));
  }
  return results;
};

TravisPusher.prototype.unsubscribeAll = function (channels) {
  let channel, i, len, results;
  results = [];
  for (i = 0, len = channels.length; i < len; i++) {
    channel = channels[i];
    results.push(this.unsubscribe(channel));
  }
  return results;
};

TravisPusher.prototype.subscribe = function (channelName) {
  if (channelName && this.pusher && !this.pusher.channel(channelName)) {
    this.active_channels.push(channelName);
    return this.pusher.subscribe(channelName).bind_global((event, data) => {
      this.receive(event, data);
    });
  }
};

TravisPusher.prototype.unsubscribe = function (channelName) {
  if (channelName && this.pusher) {
    this.active_channels.removeObject(channelName);
    return this.pusher.unsubscribe(channelName);
  }
};

TravisPusher.prototype.receive = function (event, data) {
  if (event.substr(0, 6) === 'pusher') {
    return;
  }
  if (data.id) {
    data = this.normalize(event, data);
  }

  // TODO remove job:requeued, once sf-restart-event has been merged
  // TODO this also needs to clear logs on build:created if matrix jobs are already loaded
  if (event === 'job:created' || event === 'job:requeued') {
    let job = this.store.peekRecord('job', data.job.id);
    if (job) {
      job.clearLog();
    }
  }

  next(() => this.pusherService.receive(event, data));
};

TravisPusher.prototype.normalize = function (event, data) {
  switch (event) {
    case 'build:started':
    case 'build:finished':
      return data;
    case 'job:created':
    case 'job:queued':
    case 'job:received':
    case 'job:started':
    case 'job:requeued':
    case 'job:finished':
    case 'job:log':
    case 'job:canceled':
      if (data.queue) {
        data.queue = data.queue.replace('builds.', '');
      }
      return {
        job: data,
        _no_full_payload: data._no_full_payload
      };
    case 'worker:added':
    case 'worker:updated':
    case 'worker:removed':
      return {
        worker: data
      };
    case 'annotation:created':
    case 'annotation:updated':
      return {
        annotation: data
      };
  }
};

TravisPusher.prototype.warn = function (type, object) {
  if (!this.ignoreWarning(type, object.error)) {
    // eslint-disable-next-line
    return console.warn(type, object.error);
  }
};

TravisPusher.prototype.ignoreWarning = function (type, error) {
  let code, message, ref, ref1;
  code = (error != null ? (ref = error.data) != null ? ref.code : void 0 : void 0) || 0;
  message = (error != null ? (ref1 = error.data) != null ? ref1.message : void 0 : void 0) || '';
  return this.ignoreCode(code) || this.ignoreMessage(message);
};

TravisPusher.prototype.ignoreCode = function (code) {
  return code === 1006;
};

TravisPusher.prototype.ignoreMessage = function (message) {
  let existingSubscription = message.indexOf('Existing subscription') === 0;
  let noSubscription = message.indexOf('No current subscription') === 0;
  return existingSubscription || noSubscription;
};

export default TravisPusher;
