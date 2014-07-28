require 'ext/ember/bound_helper'

safe = (string) ->
  new Handlebars.SafeString(string)

Travis.Tab = Ember.Object.extend
  url: (->
    id = @get('id')
    if id == 'env_vars'
      id
    else
      "repo.settings.#{id}"
  ).property('id')

Travis.TabsView = Ember.View.extend
  tabBinding: 'controller.tab'
  tabsBinding: 'controller.tabs'

  # TODO: remove hardcoded link
  layout: Ember.Handlebars.compile(
    '<ul class="tabs">' +
    '  {{#each tab in _tabs}}' +
    '    <li {{bindAttr class="tab.visible:active"}}>' +
    '      <h5>{{#link-to tab.url}}{{tab.name}}{{/link-to}}</h5>' +
    '    </li>' +
    '  {{/each}}' +
    '</ul>' +
    '{{yield}}')

Ember.Handlebars.registerHelper('travis-tabs', (options) ->
  template   = options.fn
  delete options.fn

  view = Travis.TabsView.create(
    controller: this
    template: template
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Travis.FormSettingsView = Ember.View.extend Ember.TargetActionSupport,
  target: Ember.computed.alias('controller')
  actionContext: Ember.computed.alias('context'),
  action: 'submit'
  tagName: 'form'
  submit: (event) ->
    event.preventDefault()
    @triggerAction()

Ember.LinkView.reopen
  init: ->
    @_super()
    eventName = Ember.get(this, 'eventName')
    if Ember.get(this, 'trackEvent')
      @on(eventName, this, @_trackEvent)
    @on(eventName, this, @_invoke)

  _trackEvent: (event) ->
    event.preventDefault()

Ember.Handlebars.registerHelper('settings-form', (path, options) ->
  if arguments.length == 1
    options = path
    path = 'settings'

  view = Travis.FormSettingsView.create(
    template: options.fn
    controller: this
    settingsPath: path
  )

  delete options.fn

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Ember.registerBoundHelper 'capitalize', (value, options) ->
  if value?
    safe $.capitalize(value)
  else
    ''

Ember.Handlebars.helper('githubCommitLink', (slug, commitSha) ->
  return '' unless commitSha
  sha = Handlebars.Utils.escapeExpression Travis.Helpers.formatCommit(commitSha)
  return sha unless slug
  url = Handlebars.Utils.escapeExpression Travis.Urls.githubCommit(slug, sha)

  safe '<a class="github-link only-on-hover" href="' + url + '">' + sha + '</a>'
)

Ember.registerBoundHelper 'formatTime', (value, options) ->
  safe Travis.Helpers.timeAgoInWords(value) || '-'

Ember.registerBoundHelper 'formatDuration', (duration, options) ->
  safe Travis.Helpers.timeInWords(duration)

Ember.Handlebars.helper('formatCommit', (commit) ->
  safe Travis.Helpers.formatCommit(commit.get('sha'), commit.get('branch')) if commit
, 'sha', 'branch')

Ember.Handlebars.helper 'formatSha', (sha) ->
  safe Travis.Helpers.formatSha(sha)

Ember.registerBoundHelper 'pathFrom', (url, options) ->
  safe Travis.Helpers.pathFrom(url)

Ember.Handlebars.helper 'formatMessage', (message, options) ->
  safe Travis.Helpers.formatMessage(message, options.hash)

Ember.registerBoundHelper 'formatConfig', (config, options) ->
  safe Travis.Helpers.formatConfig(config)

Ember.registerBoundHelper 'shortCompareShas', (url, options) ->
  path = Travis.Helpers.pathFrom(url)
  if path.indexOf('...') >= 0
    shas = path.split('...')
    "#{shas[0][0..6]}..#{shas[1][0..6]}"
  else
    path

Ember.registerBoundHelper 'formatLog', (log, options) ->
  parentView =  @get 'parentView'
  repo = parentView.get(options.repo)
  item = parentView.get(options.item)
  Travis.Helpers.formatLog(log, repo, item) || ''

