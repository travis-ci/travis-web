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

    @on 'user:refreshed', (user) ->
      Travis.onUserUpdate(user)

    @on 'user:synced', (user) ->
      Travis.onUserUpdate(user)

    @on 'user:signed_out', () ->
      if config.userlike
        Travis.removeUserlike()

  currentDate: ->
    new Date()

  onUserUpdate: (user) ->
    if config.pro
      @identifyCustomer(user)
    if config.userlike
      @setupUserlike(user)

    @subscribePusher(user)

  subscribePusher: (user) ->
    return unless user.channels
    channels = user.channels
    if config.pro
      channels = channels.map (channel) ->
        if channel.match /^private-/
          channel
        else
          "private-#{channel}"

    Travis.pusher.subscribeAll(channels)

  setupUserlike: (user) ->

    btn = document.getElementById('userlikeCustomTab')
    btn.classList.add("logged-in")

    userlikeData = window.userlikeData = {}
    userlikeData.user = {}

    userlikeData.user.name= user.login;
    userlikeData.user.email = user.email;

    unless document.getElementById('userlike-script')
      s = document.createElement('script')
      s.id = 'userlike-script'
      s.src = '//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/0327dbb23382ccbbb91b445b76e8a91d4b37d90ef9f2faf84e11177847ff7bb9.js'
      document.body.appendChild(s)

  removeUserlike: () ->
    btn = document.getElementById('userlikeCustomTab')
    btn.classList.remove("logged-in")

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
