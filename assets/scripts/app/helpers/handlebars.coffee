require 'ext/ember/bound_helper'

safe = (string) ->
  new Handlebars.SafeString(string)

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Handlebars.registerHelper 't', (key) ->
  safe I18n.t(key)

Ember.registerBoundHelper 'capitalize', (value, options) ->
  safe $.capitalize(value)

Ember.registerBoundHelper 'formatTime', (value, options) ->
  safe Travis.Helpers.timeAgoInWords(value) || '-'

Ember.registerBoundHelper 'formatDuration', (duration, options) ->
  safe Travis.Helpers.timeInWords(duration)

Ember.registerBoundHelper 'formatCommit', (commit, options) ->
  safe Travis.Helpers.formatCommit(commit.get('sha'), commit.get('branch')) if commit

Ember.registerBoundHelper 'formatSha', (sha, options) ->
  safe Travis.Helpers.formatSha(sha)

Ember.registerBoundHelper 'pathFrom', (url, options) ->
  safe Travis.Helpers.pathFrom(url)

Ember.registerBoundHelper 'formatMessage', (message, options) ->
  safe Travis.Helpers.formatMessage(message, options)

Ember.registerBoundHelper 'formatConfig', (config, options) ->
  safe Travis.Helpers.formatConfig(config)

Ember.registerBoundHelper 'formatLog', (log, options) ->
  parentView =  @get 'parentView'
  repo = parentView.get(options.repo)
  item = parentView.get(options.item)
  Travis.Helpers.formatLog(log, repo, item) || ''

