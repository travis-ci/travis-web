Travis.Pusher = (config) ->
  @init(config)
  this

if Travis.config.pro
  $.extend Travis.Pusher,
      CHANNELS: []
      CHANNEL_PREFIX: 'private-'
      ENCRYPTED: true
      KEY: ''
else
  $.extend Travis.Pusher,
    CHANNELS: ['common']
    CHANNEL_PREFIX: ''
    ENCRYPTED: false

$.extend Travis.Pusher.prototype,
  active_channels: []

  init: (config) ->
    Pusher.warn = @warn.bind(this)
    Pusher.host = config.host if config.host
    @pusher = new Pusher(config.key, encrypted: Travis.Pusher.ENCRYPTED, disableStats: true)
    @subscribeAll(Travis.Pusher.CHANNELS) if Travis.Pusher.CHANNELS

    @callbacksToProcess = []

    Visibility.change (e, state) =>
      @processSavedCallbacks() if state == 'visible'

    setInterval @processSavedCallbacks.bind(this), @processingIntervalWhenHidden

  subscribeAll: (channels) ->
    @subscribe(channel) for channel in channels

  subscribe: (channel) ->
    return unless channel
    channel = @prefix(channel)
    console.log("subscribing to #{channel}")
    unless @pusher?.channel(channel)
      @pusher.subscribe(channel).bind_all((event, data) => @receive(event, data))

  unsubscribe: (channel) ->
    return unless channel
    channel = @prefix(channel)
    console.log("unsubscribing from #{channel}")
    @pusher.unsubscribe(channel) if @pusher?.channel(channel)

  prefix: (channel) ->
    if channel.indexOf(Travis.Pusher.CHANNEL_PREFIX) != 0
      "#{Travis.Pusher.CHANNEL_PREFIX}#{channel}"
    else
      channel

  # process pusher messages in batches every 5 minutes when the page is hidden
  processingIntervalWhenHidden: 1000 * 60 * 5

  receive: (event, data) ->
    return if event.substr(0, 6) == 'pusher'
    data = @normalize(event, data) if data.id

    @processWhenVisible ->
      # TODO remove job:requeued, once sf-restart-event has been merged
      # TODO this also needs to clear logs on build:created if matrix jobs are already loaded
      if event == 'job:created' || event == 'job:requeued'
        if Travis.Job.isRecordLoaded(data.job.id)
          Travis.Job.find(data.job.id).clearLog()

      Ember.run.next ->
        Travis.receive(event, data)

  processSavedCallbacks: ->
    while callback = @callbacksToProcess.shiftObject()
      callback.call(this)

  processLater: (callback) ->
    @callbacksToProcess.pushObject(callback)

  processWhenVisible: (callback) ->
    if Visibility.hidden() && Visibility.isSupported()
      @processLater(callback)
    else
      callback.call(this)

  normalize: (event, data) ->
    switch event
      when 'build:started', 'build:finished'
        data
      when 'job:created', 'job:started', 'job:requeued', 'job:finished', 'job:log', 'job:canceled', 'job:received'
        data.queue = data.queue.replace('builds.', '') if data.queue
        { job: data }
      when 'worker:added', 'worker:updated', 'worker:removed'
        { worker: data }
      when 'annotation:created', 'annotation:updated'
        { annotation: data }

  warn: (type, object) ->
    console.warn(type, object.error) unless @ignoreWarning(type, object.error)

  ignoreWarning: (type, error) ->
    code = error?.data?.code || 0
    message = error?.data?.message || ''
    @ignoreCode(code) || @ignoreMessage(message)

  ignoreCode: (code) ->
    code == 1006

  ignoreMessage: (message) ->
    message.indexOf('Existing subscription') == 0 or message.indexOf('No current subscription') == 0

pusher_host = $('meta[name="travis.pusher_host"]').attr('value')
pusher_path = $('meta[name="travis.pusher_path"]').attr('value')

Pusher.SockJSTransport.isSupported = -> false if pusher_host != 'ws.pusherapp.com'

if Travis.config.pro
  Pusher.channel_auth_transport = 'bulk_ajax'

  Pusher.authorizers.bulk_ajax = (socketId, _callback) ->
    channels = Travis.pusher.pusher.channels
    channels.callbacks ||= []

    name = this.channel.name
    names = $.keys(channels.channels)

    channels.callbacks.push (auths) ->
      _callback(false, auth: auths[name])

    unless channels.fetching
      channels.fetching = true
      Travis.ajax.post Pusher.channel_auth_endpoint, { socket_id: socketId, channels: names }, (data) ->
        channels.fetching = false
        callback(data.channels) for callback in channels.callbacks


  Pusher.getDefaultStrategy = (config) ->
    [
      [":def", "ws_options", {
        hostUnencrypted: config.wsHost + ":" + config.wsPort + (pusher_path && "/#{pusher_path}" || ''),
        hostEncrypted: config.wsHost + ":" + config.wssPort + (pusher_path && "/#{pusher_path}" || '')
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
