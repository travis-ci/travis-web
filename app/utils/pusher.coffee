`import ENV from 'travis/config/environment'`

TravisPusher = (config, ajaxService) ->
  @init(config, ajaxService)
  this

TravisPusher.prototype.active_channels = []

TravisPusher.prototype.init = (config, ajaxService) ->
  this.ajaxService = ajaxService
  Pusher.warn = @warn.bind(this)
  Pusher.host = config.host if config.host
  @pusher = new Pusher(config.key, encrypted: config.encrypted, disableStats: true)

TravisPusher.prototype.subscribeAll = (channels) ->
  @subscribe(channel) for channel in channels

TravisPusher.prototype.unsubscribeAll = (channels) ->
  @unsubscribe(channel) for channel in channels

TravisPusher.prototype.subscribe = (channel) ->
  return unless channel
  channel = @prefix(channel)
  unless @pusher?.channel(channel)
    @pusher.subscribe(channel).bind_all((event, data) => @receive(event, data))

TravisPusher.prototype.unsubscribe = (channel) ->
  return unless channel
  channel = @prefix(channel)
  console.log("unsubscribing from #{channel}")
  @pusher.unsubscribe(channel) if @pusher?.channel(channel)

TravisPusher.prototype.prefix = (channel) ->
  prefix = ENV.pusher.channelPrefix || ''
  if channel.indexOf(prefix) != 0
    "#{prefix}#{channel}"
  else
    channel

TravisPusher.prototype.receive = (event, data) ->
  return if event.substr(0, 6) == 'pusher'
  data = @normalize(event, data) if data.id

  # TODO remove job:requeued, once sf-restart-event has been merged
  # TODO this also needs to clear logs on build:created if matrix jobs are already loaded
  if event == 'job:created' || event == 'job:requeued'
    if job = @store.getById('job', data.job.id)
      job.clearLog()

  Ember.run.next =>
    @store.receivePusherEvent(event, data)

TravisPusher.prototype.normalize = (event, data) ->
  switch event
    when 'build:started', 'build:finished'
      data
    when 'job:created', 'job:queued', 'job:received', 'job:started', 'job:requeued', 'job:finished', 'job:log', 'job:canceled'
      data.queue = data.queue.replace('builds.', '') if data.queue
      { job: data }
    when 'worker:added', 'worker:updated', 'worker:removed'
      { worker: data }
    when 'annotation:created', 'annotation:updated'
      { annotation: data }

TravisPusher.prototype.warn = (type, object) ->
  console.warn(type, object.error) unless @ignoreWarning(type, object.error)

TravisPusher.prototype.ignoreWarning = (type, error) ->
  code = error?.data?.code || 0
  message = error?.data?.message || ''
  @ignoreCode(code) || @ignoreMessage(message)

TravisPusher.prototype.ignoreCode = (code) ->
  code == 1006

TravisPusher.prototype.ignoreMessage = (message) ->
  message.indexOf('Existing subscription') == 0 or message.indexOf('No current subscription') == 0

Pusher.SockJSTransport.isSupported = -> false if ENV.pusher.host != 'ws.pusherapp.com'

if ENV.pro
  Pusher.channel_auth_transport = 'bulk_ajax'

  Pusher.authorizers.bulk_ajax = (socketId, _callback) ->
    channels = Travis.pusher.pusher.channels
    channels.callbacks ||= []

    name = this.channel.name
    names = Object.keys(channels.channels)

    channels.callbacks.push (auths) ->
      _callback(false, auth: auths[name])

    unless channels.fetching
      channels.fetching = true
      TravisPusher.ajaxService.post Pusher.channel_auth_endpoint, { socket_id: socketId, channels: names }, (data) ->
        channels.fetching = false
        callback(data.channels) for callback in channels.callbacks


  Pusher.getDefaultStrategy = (config) ->
    [
      [":def", "ws_options", {
        hostUnencrypted: config.wsHost + ":" + config.wsPort + (ENV.pusher.path && "/#{config.pusher.path}" || ''),
        hostEncrypted: config.wsHost + ":" + config.wssPort + (ENV.pusher.path && "/#{config.pusher.path}" || '')
        path: config.path
      }],
      [":def", "sockjs_options", {
        hostUnencrypted: config.httpHost + ":" + config.httpPort,
        hostEncrypted: config.httpHost + ":" + config.httpsPort
      }],
      [":def", "timeouts", {
        loop: true,
        timeout: 15000,
        timeoutLimit: 60000
      }],

      [":def", "ws_manager", [":transport_manager", {
        lives: 2,
        minPingDelay: 10000,
        maxPingDelay: config.activity_timeout
      }]],

      [":def_transport", "ws", "ws", 3, ":ws_options", ":ws_manager"],
      [":def_transport", "flash", "flash", 2, ":ws_options", ":ws_manager"],
      [":def_transport", "sockjs", "sockjs", 1, ":sockjs_options"],
      [":def", "ws_loop", [":sequential", ":timeouts", ":ws"]],
      [":def", "flash_loop", [":sequential", ":timeouts", ":flash"]],
      [":def", "sockjs_loop", [":sequential", ":timeouts", ":sockjs"]],

      [":def", "strategy",
        [":cached", 1800000,
          [":first_connected",
            [":if", [":is_supported", ":ws"], [
                ":best_connected_ever", ":ws_loop", [":delayed", 2000, [":sockjs_loop"]]
              ], [":if", [":is_supported", ":flash"], [
                ":best_connected_ever", ":flash_loop", [":delayed", 2000, [":sockjs_loop"]]
              ], [
                ":sockjs_loop"
              ]
            ]]
          ]
        ]
      ]
    ]

`export default TravisPusher`
