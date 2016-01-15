import ENV from 'travis/config/environment';
import Ember from 'ember';

var TravisPusher = function(config, ajaxService) {
  this.init(config, ajaxService);
  TravisPusher.ajaxService = ajaxService;
  return this;
};

TravisPusher.prototype.active_channels = [];

TravisPusher.prototype.init = function(config, ajaxService) {
  this.ajaxService = ajaxService;
  Pusher.warn = this.warn.bind(this);
  if (config.host) {
    Pusher.host = config.host;
  }
  return this.pusher = new Pusher(config.key, {
    encrypted: config.encrypted,
    disableStats: true
  });
};

TravisPusher.prototype.subscribeAll = function(channels) {
  var channel, i, len, results;
  results = [];
  for (i = 0, len = channels.length; i < len; i++) {
    channel = channels[i];
    results.push(this.subscribe(channel));
  }
  return results;
};

TravisPusher.prototype.unsubscribeAll = function(channels) {
  var channel, i, len, results;
  results = [];
  for (i = 0, len = channels.length; i < len; i++) {
    channel = channels[i];
    results.push(this.unsubscribe(channel));
  }
  return results;
};

TravisPusher.prototype.subscribe = function(channel) {
  var ref;
  if (!channel) {
    return;
  }
  channel = this.prefix(channel);
  if (!((ref = this.pusher) != null ? ref.channel(channel) : void 0)) {
    return this.pusher.subscribe(channel).bind_all((function(_this) {
      return function(event, data) {
        return _this.receive(event, data);
      };
    })(this));
  }
};

TravisPusher.prototype.unsubscribe = function(channel) {
  var ref;
  if (!channel) {
    return;
  }
  channel = this.prefix(channel);
  console.log("unsubscribing from " + channel);
  if ((ref = this.pusher) != null ? ref.channel(channel) : void 0) {
    return this.pusher.unsubscribe(channel);
  }
};

TravisPusher.prototype.prefix = function(channel) {
  var prefix;
  prefix = ENV.pusher.channelPrefix || '';
  if (channel.indexOf(prefix) !== 0) {
    return "" + prefix + channel;
  } else {
    return channel;
  }
};

TravisPusher.prototype.receive = function(event, data) {
  var job;
  if (event.substr(0, 6) === 'pusher') {
    return;
  }
  if (data.id) {
    data = this.normalize(event, data);
  }

  // TODO remove job:requeued, once sf-restart-event has been merged
  // TODO this also needs to clear logs on build:created if matrix jobs are already loaded
  if (event === 'job:created' || event === 'job:requeued') {
    if (job = this.store.peekRecord('job', data.job.id)) {
      job.clearLog();
    }
  }
  return Ember.run.next((function(_this) {
    return function() {
      return _this.store.receivePusherEvent(event, data);
    };
  })(this));
};

TravisPusher.prototype.normalize = function(event, data) {
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
        job: data
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

TravisPusher.prototype.warn = function(type, object) {
  if (!this.ignoreWarning(type, object.error)) {
    return console.warn(type, object.error);
  }
};

TravisPusher.prototype.ignoreWarning = function(type, error) {
  var code, message, ref, ref1;
  code = (error != null ? (ref = error.data) != null ? ref.code : void 0 : void 0) || 0;
  message = (error != null ? (ref1 = error.data) != null ? ref1.message : void 0 : void 0) || '';
  return this.ignoreCode(code) || this.ignoreMessage(message);
};

TravisPusher.prototype.ignoreCode = function(code) {
  return code === 1006;
};

TravisPusher.prototype.ignoreMessage = function(message) {
  return message.indexOf('Existing subscription') === 0 || message.indexOf('No current subscription') === 0;
};

Pusher.SockJSTransport.isSupported = function() {
  if (ENV.pusher.host !== 'ws.pusherapp.com') {
    return false;
  }
};

if (ENV.pro) {
  Pusher.channel_auth_transport = 'bulk_ajax';
  Pusher.authorizers.bulk_ajax = function(socketId, _callback) {
    var channels, name, names;
    channels = Travis.pusher.pusher.channels;
    channels.callbacks = channels.callbacks || [];
    name = this.channel.name;
    names = Object.keys(channels.channels);
    channels.callbacks.push(function(auths) {
      return _callback(false, {
        auth: auths[name]
      });
    });
    if (!channels.fetching) {
      channels.fetching = true;
      return TravisPusher.ajaxService.post(Pusher.channel_auth_endpoint, {
        socket_id: socketId,
        channels: names
      }, function(data) {
        var callback, i, len, ref, results;
        channels.fetching = false;
        ref = channels.callbacks;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          callback = ref[i];
          results.push(callback(data.channels));
        }
        return results;
      });
    }
  };
  Pusher.getDefaultStrategy = function(config) {
    return [
      [
        ":def", "ws_options", {
          hostUnencrypted: config.wsHost + ":" + config.wsPort + (ENV.pusher.path && ("/" + ENV.pusher.path) || ''),
          hostEncrypted: config.wsHost + ":" + config.wssPort + (ENV.pusher.path && ("/" + ENV.pusher.path) || ''),
          path: config.path
        }
      ], [
        ":def", "sockjs_options", {
          hostUnencrypted: config.httpHost + ":" + config.httpPort,
          hostEncrypted: config.httpHost + ":" + config.httpsPort
        }
      ], [
        ":def", "timeouts", {
          loop: true,
          timeout: 15000,
          timeoutLimit: 60000
        }
      ], [
        ":def", "ws_manager", [
          ":transport_manager", {
            lives: 2,
            minPingDelay: 10000,
            maxPingDelay: config.activity_timeout
          }
        ]
      ], [":def_transport", "ws", "ws", 3, ":ws_options", ":ws_manager"], [":def_transport", "flash", "flash", 2, ":ws_options", ":ws_manager"], [":def_transport", "sockjs", "sockjs", 1, ":sockjs_options"], [":def", "ws_loop", [":sequential", ":timeouts", ":ws"]], [":def", "flash_loop", [":sequential", ":timeouts", ":flash"]], [":def", "sockjs_loop", [":sequential", ":timeouts", ":sockjs"]], [":def", "strategy", [":cached", 1800000, [":first_connected", [":if", [":is_supported", ":ws"], [":best_connected_ever", ":ws_loop", [":delayed", 2000, [":sockjs_loop"]]], [":if", [":is_supported", ":flash"], [":best_connected_ever", ":flash_loop", [":delayed", 2000, [":sockjs_loop"]]], [":sockjs_loop"]]]]]]
    ];
  };
}

export default TravisPusher;
