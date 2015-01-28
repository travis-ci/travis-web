require 'helpers/handlebars'
require 'helpers/helpers'
require 'helpers/urls'
require 'helpers/status_image_formats'
require 'helpers/github_url_properties'

Travis.Handlebars = {}

require 'helpers/label'
require 'helpers/input'
require 'helpers/tipsy'
require 'helpers/travis-errors'
require 'helpers/travis-field'
require 'helpers/travis-field'
require 'helpers/filter-input'
require 'helpers/capitalize'
require 'helpers/github_commit_link'
require 'helpers/format_time'
require 'helpers/format_duration'
require 'helpers/format_commit'
require 'helpers/format_sha'
require 'helpers/format_message'
require 'helpers/format_config'
require 'helpers/short_compare_shas'
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

