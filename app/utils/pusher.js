import Pusher from 'npm:pusher-js';

import { next } from '@ember/runloop';
import ENV from 'travis/config/environment';

let TravisPusher = function (config, ajaxService) {
  this.active_channels = [];
  this.init(config, ajaxService);
  TravisPusher.ajaxService = ajaxService;
  return this;
};

TravisPusher.prototype.init = function (config, ajaxService) {
  if (!config.key) {
    // Set up a mock Pusher that ignores the expected methods.
    return this.pusher = {
      subscribe() {
        return {
          bind_all() {}
        };
      },
      channel() {}
    };
  }

  this.ajaxService = ajaxService;
  Pusher.warn = this.warn.bind(this);
  if (config.host) {
    Pusher.host = config.host;
  }

  if (config.debug) {
    Pusher.log = function (message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };
  }

  return this.pusher = new Pusher(config.key, {
    encrypted: config.encrypted,
    disableStats: true,
    authorizer: function (channel, options) {
      return {
        authorize: function (socketId, callback) {
          let channelName = this.channel.name;
          TravisPusher.ajaxService.post(Pusher.channel_auth_endpoint, {
            socket_id: socketId,
            channels: [channelName]
          }).then((data) => {
            callback(false, { auth: data['channels'][channelName] });
          });
        }
      };
    }
  });
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
    return this.pusher.subscribe(channelName).bind_all((event, data) => {
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

// FIXME is this still needed?
// Pusher.SockJSTransport.isSupported = function () {
//   if (ENV.pusher.host !== 'ws.pusherapp.com') {
//     return false;
//   }
// };

Pusher.getDefaultStrategy = function (config) {
  let pusherPath = ENV.pusher.path || '';
  if (pusherPath) {
    pusherPath = `/${pusherPath}`;
  }
  return [
    [
      ':def', 'ws_options', {
        hostUnencrypted: `${config.wsHost}:${config.wsPort}${pusherPath}`,
        hostEncrypted: `${config.wsHost}:${config.wssPort}${pusherPath}`,
        path: config.path
      }
    ], [
      ':def', 'sockjs_options', {
        hostUnencrypted: `${config.httpHost}:${config.httpPort}`,
        hostEncrypted: `${config.httpHost}:${config.httpsPort}`
      }
    ], [
      ':def', 'timeouts', {
        loop: true,
        timeout: 15000,
        timeoutLimit: 60000
      }
    ], [
      ':def', 'ws_manager', [
        ':transport_manager', {
          lives: 2,
          minPingDelay: 10000,
          maxPingDelay: config.activity_timeout
        }
      ]
    // eslint-disable-next-line
    ], [':def_transport', 'ws', 'ws', 3, ':ws_options', ':ws_manager'], [':def_transport', 'flash', 'flash', 2, ':ws_options', ':ws_manager'], [':def_transport', 'sockjs', 'sockjs', 1, ':sockjs_options'], [':def', 'ws_loop', [':sequential', ':timeouts', ':ws']], [':def', 'flash_loop', [':sequential', ':timeouts', ':flash']], [':def', 'sockjs_loop', [':sequential', ':timeouts', ':sockjs']], [':def', 'strategy', [':cached', 1800000, [':first_connected', [':if', [':is_supported', ':ws'], [':best_connected_ever', ':ws_loop', [':delayed', 2000, [':sockjs_loop']]], [':if', [':is_supported', ':flash'], [':best_connected_ever', ':flash_loop', [':delayed', 2000, [':sockjs_loop']]], [':sockjs_loop']]]]]]
  ];
};

export default TravisPusher;
