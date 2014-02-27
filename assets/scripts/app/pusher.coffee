Travis.Pusher = (key) ->
  @init(key) # if key
  this

$.extend Travis.Pusher,
  CHANNELS: ['common']
  CHANNEL_PREFIX: ''
  ENCRYPTED: false

$.extend Travis.Pusher.prototype,
  active_channels: []

  init: (key) ->
    Pusher.warn = @warn.bind(this)
    @pusher = new Pusher(key, encrypted: Travis.Pusher.ENCRYPTED)
    @subscribeAll(Travis.Pusher.CHANNELS) if Travis.Pusher.CHANNELS

    @callbacksToProcess = []

    Visibility.change (e, state) =>
      if state == 'visible'
        @processSavedCallbacks()

    setInterval @processSavedCallbacks.bind(this), @processingIntervalWhenHidden

  subscribeAll: (channels) ->
    for channel in channels
      name = @prefix(channel)
      channel = @pusher.subscribe(channel)
      channel.bind_all((event, data) => @receive(event, data))

  subscribe: (channel) ->
    console.log("subscribing to #{channel}")
    channel = @prefix(channel)
    @pusher.subscribe(channel).bind_all((event, data) => @receive(event, data)) unless @pusher?.channel(channel)

  unsubscribe: (channel) ->
    console.log("unsubscribing from #{channel}")
    channel = @prefix(channel)
    @pusher.unsubscribe(channel) if @pusher?.channel(channel)

  prefix: (channel) ->
    "#{Travis.Pusher.CHANNEL_PREFIX}#{channel}"

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
      when 'job:created', 'job:started', 'job:requeued', 'job:finished', 'job:log', 'job:canceled'
        data.queue = data.queue.replace('builds.', '') if data.queue
        { job: data }
      when 'worker:added', 'worker:updated', 'worker:removed'
        { worker: data }
      when 'annotation:created', 'annotation:updated'
        { annotation: data }

  warn: (type, warning) ->
    console.warn(warning) unless @ignoreWarning(warning)

  ignoreWarning: (warning) ->
    if message = warning.data?.message
      message.indexOf('Existing subscription') == 0 or message.indexOf('No current subscription') == 0
