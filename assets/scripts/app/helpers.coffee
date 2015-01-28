require 'helpers/handlebars'
require 'helpers/helpers'
require 'helpers/urls'
require 'helpers/status-image-formats'
require 'helpers/github-url-properties'

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

