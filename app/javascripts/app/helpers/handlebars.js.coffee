safe = (string) ->
  new Handlebars.SafeString(string)

Handlebars.registerHelper 'whats_this', (id) ->
  safe '<span title="What\'s This?" class="whats_this" onclick="$.facebox({ div: \'#' + id + '\'})">&nbsp;</span>'

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Handlebars.registerHelper 't', (key) ->
  safe I18n.t(key)

Ember.registerBoundHelper 'formatTime', (value, options) ->
  safe Travis.Helpers.timeAgoInWords(value) || '-'

Ember.registerBoundHelper 'formatDuration', (duration, options) ->
  safe Travis.Helpers.timeInWords(duration)

Ember.registerBoundHelper 'formatCommit', (commit, options) ->
  branch = commit.get('branch')
  branch = " #{branch}" if branch
  safe (commit.get('sha') || '').substr(0, 7) + branch

Ember.registerBoundHelper 'formatSha', (sha, options) ->
  safe (sha || '').substr(0, 7)

Ember.registerBoundHelper 'pathFrom', (url, options) ->
  safe (url || '').split('/').pop()

Ember.registerBoundHelper 'formatMessage', (message, options) ->
  safe Travis.Helpers.formatMessage(message, options)

Ember.registerBoundHelper 'formatConfig', (config, options) ->
  safe Travis.Helpers.formatConfig(config)

Ember.registerBoundHelper 'formatLog', (log, options) ->
  Travis.Log.filter(log) if log

