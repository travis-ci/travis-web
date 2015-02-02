require 'config/environment'
require 'utils/computed-limit'
require 'app'

window.ENV ||= {}
window.ENV.RAISE_ON_DEPRECATION = true

window.Travis = App.create()

Travis.deferReadiness()

Ember.LinkView.reopen
  loadingClass: 'loading_link'

if charm_key = $('meta[name="travis.charm_key"]').attr('value')
  @__CHARM =
    key: $('meta[name="travis.charm_key"]').attr('value')
    url: "https://charmscout.herokuapp.com/feedback"

  $('head').append $('<script src="https://charmscout.herokuapp.com/charmeur.js?v=2" async defer></script>')

require 'utils/ajax'

require 'utils/keys-map'
require 'utils/urls'
require 'utils/helpers'
require 'utils/status-image-formats'
require 'utils/pusher'
require 'utils/slider'
require 'utils/tailing'
require 'utils/to-top'
require 'mixins/github-url-properties'

require 'utils/keys-map'
require 'adapters/application'
require 'serializers/application'
require 'serializers/repo'
require 'serializers/job'
require 'serializers/build'
require 'serializers/account'
require 'serializers/request'
require 'serializers/env-var'
require 'adapters/env-var'
require 'adapters/ssh-key'
require 'transforms/object'

require 'store'

require 'router'
require 'routes/abstract-builds'
require 'routes/account'
require 'routes/accounts/index'
require 'routes/accounts/info'
require 'routes/accounts'
require 'routes/application'
require 'routes/auth'
require 'routes/branches'
require 'routes/build'
require 'routes/builds'
require 'routes/caches'
require 'routes/env-vars'
require 'routes/first-sync'
require 'routes/getting-started'
require 'routes/insufficient-oauth-permissions'
require 'routes/job'
require 'routes/main/index'
require 'routes/main/my-repositories'
require 'routes/main/recent'
require 'routes/main/repositories'
require 'routes/main/search'
require 'routes/main'
require 'routes/main-tab'
require 'routes/not-found'
require 'routes/profile'
require 'routes/pull-requests'
require 'routes/repo/index'
require 'routes/repo'
require 'routes/request'
require 'routes/requests'
require 'routes/basic'
require 'routes/settings/index'
require 'routes/settings'
require 'routes/simple-layout'
require 'routes/ssh-key'
require 'routes/dashboard'
require 'routes/dashboard/repositories'

require 'utils/auth'

require 'controllers/accounts'
require 'controllers/auth'
require 'controllers/account'
require 'controllers/build'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/job'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/settings/index'
require 'controllers/current-user'
require 'controllers/request'
require 'controllers/requests'
require 'controllers/caches'
require 'controllers/caches-item'
require 'controllers/caches-by-branch'
require 'controllers/env-var'
require 'controllers/env-vars'
require 'controllers/env-var-new'
require 'controllers/ssh-key'
require 'controllers/sidebar'
require 'controllers/top'
require 'controllers/first-sync'
require 'controllers/accounts/info'
require 'controllers/main/error'
require 'controllers/builds/item'
require 'controllers/queue'
require 'controllers/running-jobs'
require 'controllers/dashboard/repositories'

Travis.Handlebars = {}

require 'helpers/label'
require 'helpers/input'
require 'helpers/tipsy'
require 'helpers/travis-errors'
require 'helpers/travis-field'
require 'helpers/travis-field'
require 'helpers/filter-input'
require 'helpers/capitalize'
require 'helpers/github-commit-link'
require 'helpers/format-time'
require 'helpers/format-duration'
require 'helpers/format-commit'
require 'helpers/format-sha'
require 'helpers/format-message'
require 'helpers/format-config'
require 'helpers/short-compare-shas'
require 'helpers/mb'

Ember.Handlebars.registerHelper('label', Travis.Handlebars.label)
Ember.Handlebars.registerHelper('input', Travis.Handlebars.input)
Ember.Handlebars.registerHelper('tipsy', Travis.Handlebars.tipsy)
Ember.Handlebars.registerHelper('travis-errors', Travis.Handlebars.travisErrors)
Ember.Handlebars.registerHelper('travis-field', Travis.Handlebars.travisField)
Ember.Handlebars.registerHelper('filter-input', Travis.Handlebars.filterInput)

Ember.Handlebars.registerBoundHelper('capitalize', Travis.Handlebars.capitalize)
Ember.Handlebars.registerBoundHelper('github-commit-link', Travis.Handlebars.githubCommitLink)
Ember.Handlebars.registerBoundHelper('format-time', Travis.Handlebars.formatTime)
Ember.Handlebars.registerBoundHelper('format-duration', Travis.Handlebars.formatDuration)
Ember.Handlebars.registerBoundHelper('format-commit', Travis.Handlebars.formatCommit, 'sha', 'branch')
Ember.Handlebars.registerBoundHelper('format-sha', Travis.Handlebars.formatSha)
Ember.Handlebars.registerBoundHelper('format-message', Travis.Handlebars.formatMessage)
Ember.Handlebars.registerBoundHelper('format-config', Travis.Handlebars.formatConfig)
Ember.Handlebars.registerBoundHelper('short-compare-shas', Travis.Handlebars.shortCompareShas)
Ember.Handlebars.registerBoundHelper('mb', Travis.Handlebars.mb)

Ember.LinkView.reopen
  init: ->
    @_super()
    eventName = Ember.get(this, 'eventName')
    if Ember.get(this, 'trackEvent')
      @on(eventName, this, @_trackEvent)
    @on(eventName, this, @_invoke)

  _trackEvent: (event) ->
    event.preventDefault()

require 'models/account'
require 'models/broadcast'
require 'models/branch'
require 'models/build'
require 'models/commit'
require 'models/hook'
require 'models/job'
require 'models/log'
require 'models/annotation'
require 'models/repo'
require 'models/request'
require 'models/user'
require 'models/env-var'
require 'models/ssh-key'

require 'vendor/log'

require 'views/basic'
require 'views/flash-item'
require 'views/accounts-info'
require 'views/hooks'
require 'views/pre'
require 'views/annotation'
require 'views/application'
require 'views/build'
require 'views/flash'
require 'views/job'
require 'views/jobs'
require 'views/jobs-item'
require 'views/log'
require 'views/repo'
require 'views/repos-list'
require 'views/repos-list-tabs'
require 'views/repo-show-tools'
require 'views/repo-show-tabs'
require 'views/repo-actions'
require 'views/profile'
require 'views/profile-tabs'
require 'views/signin'
require 'views/top'
require 'views/status-images'
require 'views/status-image-input'
require 'views/dashboard'
require 'views/show-more-button'
require 'views/main'
require 'views/not-found'
require 'views/auth/signin'
require 'views/insufficient-oauth-permissions'
require 'views/first-sync'
require 'views/application/loading'
require 'views/dashboard/loading'

require 'components/travis-switch'

require 'initializers/auth'
require 'initializers/config'
require 'initializers/google-analytics'
require 'initializers/pusher'
require 'initializers/services'
require 'initializers/storage'
require 'initializers/stylesheets-manager'

require 'templates'
