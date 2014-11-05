safe = (string) ->
  new Handlebars.SafeString(string)

Ember.Handlebars.helper('mb', (size) ->
  if size
    (size / 1024 / 1024).toFixed(2)
, 'size')

Ember.LinkView.reopen
  init: ->
    @_super()
    eventName = Ember.get(this, 'eventName')
    if Ember.get(this, 'trackEvent')
      @on(eventName, this, @_trackEvent)
    @on(eventName, this, @_invoke)

  _trackEvent: (event) ->
    event.preventDefault()

FormFieldRowView = Ember.View.extend
  invalid: Ember.computed.notEmpty('errors.[]')
  classNameBindings: ['invalid']
  classNames: 'field'

LabelView = Ember.View.extend(
  tagName: 'label'

  attributeBindings: ['for', 'accesskey', 'form']
  classNameBindings: ['class']
)

Ember.Handlebars.registerHelper('label', (options) ->
  view = LabelView

  name = options.hash.for
  if name
    labels = @get('_labels')
    unless labels
      labels = Ember.Object.create()
      @set('_labels', labels)

    # for now I support only label + input in their own context
    id = labels.get(name)
    unless id
      id = "#{name}-#{Math.round(Math.random() * 1000000)}"
      labels.set(name, id)

    options.hash.for = id
    options.hashTypes.for = 'STRING'
    options.hashContexts.for = this

  Ember.Handlebars.helpers.view.call(this, view, options)
)

originalInputHelper = Ember.Handlebars.helpers.input

Ember.Handlebars.registerHelper('input', (options) ->
  # for now I can match label only with the property name
  # passed here matches the label
  name = (options.hash.value || options.hash.checked)
  id   = options.hash.id

  # generate id only if it's not given
  if name && !name.match(/\./) && !id
    labels = @get('_labels')
    unless labels
      labels = Ember.Object.create()
      @set('_labels', labels)

    # for now I support only label + input in their own context
    id = labels.get(name)
    unless id
      id = "#{name}-#{Math.round(Math.random() * 1000000)}"
      labels.set(name, id)

    options.hash.id = id
    options.hashTypes.id = 'STRING'
    options.hashContexts.id = this

  originalInputHelper.call(this, options)
)

Ember.Handlebars.registerHelper('travis-field', (name, options) ->
  errors = @get('errors').for(name)
  template   = options.fn
  delete options.fn

  view = FormFieldRowView.create(
    controller: this
    template: template
    errors: errors
    name: name
    classNameBindings: ['name']
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Travis.ErrorsView = Ember.View.extend
  tagName: 'span'
  template: Ember.Handlebars.compile("{{#each view.errors}}{{message}}{{/each}}")
  classNames: ['error']
  classNameBindings: ['codes']
  attributeBindings: ['style']
  style: (->
    'display: none' unless @get('show')
  ).property('show')
  codes: (->
    @get('errors').mapBy('code')
  ).property('@errors')
  show: Ember.computed.notEmpty('errors.[]')

Ember.Handlebars.helper('travis-errors', (name, options) ->
  errors = @get('errors').for(name)
  view = Travis.ErrorsView.create(
    controller: this
    errors: errors
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Ember.Handlebars.registerBoundHelper 'capitalize', (value, options) ->
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

Ember.Handlebars.registerBoundHelper 'formatTime', (value, options) ->
  safe Travis.Helpers.timeAgoInWords(value) || '-'

Ember.Handlebars.registerBoundHelper 'formatDuration', (duration, options) ->
  safe Travis.Helpers.timeInWords(duration)

Ember.Handlebars.helper('formatCommit', (commit) ->
  safe Travis.Helpers.formatCommit(commit.get('sha'), commit.get('branch')) if commit
, 'sha', 'branch')

Ember.Handlebars.helper 'formatSha', (sha) ->
  safe Travis.Helpers.formatSha(sha)

Ember.Handlebars.registerBoundHelper 'pathFrom', (url, options) ->
  safe Travis.Helpers.pathFrom(url)

Ember.Handlebars.helper 'formatMessage', (message, options) ->
  safe Travis.Helpers.formatMessage(message, options.hash)

Ember.Handlebars.registerBoundHelper 'formatConfig', (config, options) ->
  safe Travis.Helpers.formatConfig(config)

Ember.Handlebars.registerBoundHelper 'shortCompareShas', (url, options) ->
  path = Travis.Helpers.pathFrom(url)
  if path.indexOf('...') >= 0
    shas = path.split('...')
    "#{shas[0][0..6]}..#{shas[1][0..6]}"
  else
    path

Ember.Handlebars.registerBoundHelper 'formatLog', (log, options) ->
  parentView =  @get 'parentView'
  repo = parentView.get(options.repo)
  item = parentView.get(options.item)
  Travis.Helpers.formatLog(log, repo, item) || ''

