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

  subscribeAll: (channels) ->
    for channel in channels
      name = @prefix(channel)
      unless @pusher.channels.find(name)
        channel = @pusher.channels.add(name, this)
        channel.bind_all((event, data) => @receive(event, data))
    @pusher.subscribeAll()

  subscribe: (channel) ->
    channel = @prefix(channel)
    @pusher.subscribe(channel).bind_all((event, data) => @receive(event, data)) unless @pusher?.channel(channel)

  unsubscribe: (channel) ->
    channel = @prefix(channel)
    @pusher.unsubscribe(channel) if @pusher?.channel(channel)

  prefix: (channel) ->
    "#{Travis.Pusher.CHANNEL_PREFIX}#{channel}"

  receive: (event, data) ->
    return if event.substr(0, 6) == 'pusher'
    data = @normalize(event, data) if data.id

    if event == 'job:requeued'
      job = Travis.Job.find(data.job.id)
      job.clearLog() if job

    Ember.run.next ->
      Travis.app.store.receive(event, data)

  normalize: (event, data) ->
    switch event
      when 'build:started', 'build:finished'
        data
      when 'job:created', 'job:started', 'job:requeued', 'job:finished', 'job:log'
        data.queue = data.queue.replace('builds.', '') if data.queue
        { job: data }
      when 'worker:added', 'worker:updated', 'worker:removed'
        { worker: data }

  warn: (type, warning) ->
    console.warn(warning) unless @ignoreWarning(warning)

  ignoreWarning: (warning) ->
    if message = warning.data?.message
      message.indexOf('Existing subscription') == 0 or message.indexOf('No current subscription') == 0
