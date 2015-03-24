`import Ember from 'ember'`
`import Resolver from 'ember/resolver'`
`import loadInitializers from 'ember/load-initializers'`
`import config from './config/environment'`

`import mb from 'travis/helpers/mb'`
`import label from 'travis/helpers/label'`
`import travisField from 'travis/helpers/travis-field'`
`import travisErrors from 'travis/helpers/travis-errors'`
`import tipsy from 'travis/helpers/tipsy'`
#`import input from 'travis/helpers/input'`
`import filterInput from 'travis/helpers/filter-input'`
Ember.HTMLBars._registerHelper('label', label)
Ember.HTMLBars._registerHelper('travis-field', travisField)
Ember.HTMLBars._registerHelper('travis-errors', travisErrors)
Ember.Handlebars.registerHelper('tipsy', tipsy)
#Ember.Handlebars.registerHelper('input', input)
Ember.HTMLBars._registerHelper('filter-input', filterInput)
Ember.Handlebars.registerBoundHelper('mb', mb)

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
