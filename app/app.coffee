`import Ember from 'ember'`
`import Resolver from 'ember/resolver'`
`import loadInitializers from 'ember/load-initializers'`
`import config from './config/environment'`

Ember.MODEL_FACTORY_INJECTIONS = true

App = Ember.Application.extend(Ember.Evented,
  LOG_TRANSITIONS: true
  LOG_TRANSITIONS_INTERNAL: true
  LOG_ACTIVE_GENERATION: true
  LOG_MODULE_RESOLVER: true
  LOG_VIEW_LOOKUPS: true
  #LOG_RESOLVER: true

  modulePrefix: config.modulePrefix
  podModulePrefix: config.podModulePrefix
  Resolver: Resolver

  lookup: ->
    @__container__.lookup.apply @__container__, arguments

  flash: (options) ->
    Travis.lookup('controller:flash').loadFlashes([options])

  receive: (event, data) ->
    [name, type] = event.split(':')

    store = @__container__.lookup('store:main')

    if name == 'job' && data.job?.commit
      store.pushPayload(commits: [data.job.commit])

    if name == 'build' && data.build?.commit
      # TODO: commit should be a sideload record on build, not mixed with it
      build = data.build
      commit = {
        id:              build.commit_id
        author_email:    build.author_email
        author_name:     build.author_name
        branch:          build.branch
        committed_at:    build.committed_at
        committer_email: build.committer_email
        committer_name:  build.committer_name
        compare_url:     build.compare_url
        message:         build.message
        sha:             build.commit
      }
      delete(data.build.commit)

      store.pushPayload(commits: [commit])

    if event == 'job:log'
      data = data.job
      job = store.recordForId('job', data.id)
      job.appendLog(number: parseInt(data.number), content: data._log, final: data.final)
    else if data[name]
      @_loadOne(store, name, data)
    else
      throw "can't load data for #{name}" unless type

  _loadOne: (store, type, json) ->
    payload = {}
    payload[type.pluralize()] = [json[type]]
    store.pushPayload(payload)

    # we get other types of records only in a few situations and
    # it's not always needed to update data, so I'm specyfing which
    # things I want to update here:
    if type == 'build' && (json.repository || json.repo)
      data = json.repository || json.repo
      store.pushPayload(repos: [data])

  toggleSidebar: ->
    $('body').toggleClass('maximized')
    # TODO gotta force redraws here :/
    element = $('<span></span>')
    $('#top .profile').append(element)
    Em.run.later (-> element.remove()), 10
    element = $('<span></span>')
    $('#repo').append(element)
    Em.run.later (-> element.remove()), 10

  ready: ->
    location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'

    @on 'user:signed_in', (user) ->
      Travis.onUserUpdate(user)

    @on 'user:synced', (user) ->
      Travis.onUserUpdate(user)

  currentDate: ->
    new Date()

  onUserUpdate: (user) ->
    if config.pro
      @identifyCustomer(user)
      @subscribePusher(user)
      @setupCharm(user)

  subscribePusher: (user) ->
    channels = user.channels
    channels = channels.map (channel) ->
      if channel.match /^private-/
        channel
      else
        "private-#{channel}"
    Travis.pusher.subscribeAll(channels)

  setupCharm: (user) ->
    $.extend window.__CHARM,
      customer: user.login,
      customer_id: user.id,
      email: user.email

  displayCharm: ->
    __CHARM.show()

  identifyCustomer: (user) ->
    if _cio && _cio.identify
      _cio.identify
        id: user.id
        email: user.email
        name: user.name
        created_at: (Date.parse(user.created_at) / 1000) || null
        login: user.login
)
loadInitializers(App, config.modulePrefix)

`export default App`
