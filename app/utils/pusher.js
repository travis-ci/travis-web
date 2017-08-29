/* global Pusher */
import ENV from 'travis/config/environment';
import Ember from 'ember';

let TravisPusher = function (config, ajaxService) {
  this.init(config, ajaxService);
  TravisPusher.ajaxService = ajaxService;
  return this;
};

TravisPusher.prototype.active_channels = [];

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
    disableStats: true
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

TravisPusher.prototype.subscribe = function (channel) {
  let ref;
  if (!channel) {
    return;
  }
  if (!((ref = this.pusher) != null ? ref.channel(channel) : void 0)) {
    return this.pusher.subscribe(channel).bind_all((function (_this) {
      return function (event, data) {
        return _this.receive(event, data);
      };
    })(this));
  }
};

TravisPusher.prototype.unsubscribe = function (channel) {
  let ref;
  if (!channel) {
    return;
  }
  //eslint-disable-next-line
  console.log("unsubscribing from " + channel);
  if ((ref = this.pusher) != null ? ref.channel(channel) : void 0) {
    return this.pusher.unsubscribe(channel);
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
  return Ember.run.next((function (_this) {
    return function () {
      return _this.store.receivePusherEvent(event, data);
    };
  })(this));
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

TravisPusher.prototype.warn = function (type, object) {
  if (!this.ignoreWarning(type, object.error)) {
    //eslint-disable-next-line
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

Pusher.SockJSTransport.isSupported = function () {
  if (ENV.pusher.host !== 'ws.pusherapp.com') {
    return false;
  }
};

export default TravisPusher;
