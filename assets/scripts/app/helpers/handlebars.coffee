require 'ext/ember/bound_helper'

safe = (string) ->
  new Handlebars.SafeString(string)

Travis.Tab = Ember.Object.extend
  show: ->
    @get('tabs').forEach( (t) -> t.hide() )
    @set('visible', true)

  hide: ->
    @set('visible', false)

Travis.TabsView = Ember.View.extend
  tabBinding: 'controller.tab'
  tabsBinding: 'controller.tabs'

  tabDidChange: (->
    @activateTab(@get('tab'))
  ).observes('tab')

  tabsDidChange: (->
    tab = @get('tab')
    if tab
      @activateTab(tab)
    else if @get('tabs.length')
      @activateTab(@get('tabs.firstObject.id'))
  ).observes('tabs.length', 'tabs')

  activateTab: (tabId) ->
    tab = @get('tabs').findBy('id', tabId)

    return unless tab

    tab.show() unless tab.get('visible')

  # TODO: remove hardcoded link
  layout: Ember.Handlebars.compile(
    '<ul class="tabs">' +
    '  {{#each tab in tabs}}' +
    '    <li {{bindAttr class="tab.visible:active"}}>' +
    '      <h5>{{#linkTo "repo.settings.tab" tab.id}}{{tab.name}}{{/linkTo}}</h5>' +
    '    </li>' +
    '  {{/each}}' +
    '</ul>' +
    '{{yield}}')

Travis.TabView = Ember.View.extend
  attributeBindings: ['style']

  style: (->
    if !@get('tab.visible')
      'display: none'
  ).property('tab.visible')

Ember.Handlebars.registerHelper('travis-tab', (id, name, options) ->
  controller = this
  controller.set('tabs', []) unless controller.get('tabs')

  tab = Travis.Tab.create(id: id, name: name, tabs: controller.get('tabs'))

  view = Travis.TabView.create(
    controller: this
    tab: tab
  )

  controller = this
  Ember.run.schedule('afterRender', ->
    if controller.get('tabs.length') == 0
      tab.show()
    controller.get('tabs').pushObject(tab)
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)


Ember.Handlebars.registerHelper('travis-tabs', (options) ->
  template   = options.fn
  delete options.fn

  @set('tabs', [])

  view = Travis.TabsView.create(
    controller: this
    template: template
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Travis.SettingsMultiplierView = Ember.CollectionView.extend()

createObjects = (path, offset) ->
  segments = path.split('.')
  if segments.length > offset
    for i in [1..(segments.length - offset)]
      path = segments.slice(0, i).join('.')
      if Ember.isNone(Ember.get(this, path))
        Ember.set(this, path, {})

  return segments

Ember.Handlebars.registerHelper('settings-multiplier', (path, options) ->
  template   = options.fn
  delete options.fn

  parentsPath = getSettingsPath(options.data.view)
  if parentsPath && parentsPath != ''
    path = parentsPath + '.' + path

  createObjects.call(this, path, 1)

  if Ember.isNone(@get(path))
    collection = [{}]
    @set(path, collection)


  itemViewClass = Ember.View.extend(
    template: template,
    controller: this,
    tagName: 'li',
    multiplier: true
  )

  view = Travis.SettingsMultiplierView.create(
    contentBinding: 'controller.' + path
    controller: this
    tagName: 'ul'
    itemViewClass: itemViewClass
    fields: []
    settingsPath: path
  )

  view.addObserver('content.length', ->
    if @get('content.length') == 0
      @get('content').pushObject({})
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

Ember.Handlebars.helper('settings-select', (options) ->
  view = options.data.view
  optionValues = options.hash.options
  delete options.hash.options

  originalPath = options.hash.value

  parentsPath = getSettingsPath(view)
  #TODO: such checks should also check parents, not only current context view
  if !view.get('multiplier') && parentsPath && parentsPath != ''
    originalPath = parentsPath + '.' + originalPath

  fullPath = originalPath

  if view.get('multiplier')
    fullPath = 'view.content.' + fullPath

  createObjects.call(this, fullPath, 1)

  # TODO: setting a value here does not work and we still need
  #       a valueBinding in the view, I'm not sure why
  options.hash.value = fullPath

  selectView = Ember.Select.create(
    content: [''].pushObjects(optionValues.split(','))
    controller: this
    valueBinding: 'controller.' + fullPath
  )

  Ember.Handlebars.helpers.view.call(this, selectView, options)
)



Ember.Handlebars.helper('settings-remove-link', (options) ->
  view = Ember.View.extend(
    tagName: 'a'
    attributeBindings: ['href', 'style']
    href: '#'
    style: (->
      # TODO: do not assume that we're direct child
      if @get('parentView.parentView.content.length') == 1
        'display: none'
    ).property('parentView.parentView.content.length')
    template: Ember.Handlebars.compile('remove')
    controller: this
    click: (event) ->
      event.preventDefault()

      if content = @get('parentView.content')
        @get('parentView.parentView.content').removeObject(content)
  ).create()

  Ember.Handlebars.helpers.view.call(this, view, options)
)

Ember.Handlebars.registerHelper('settings-add-link', (path, options) ->
  parentsPath = getSettingsPath(options.data.view)
  if parentsPath && parentsPath != ''
    path = parentsPath + '.' + path

  view = Ember.View.create(
    tagName: 'a'
    attributeBindings: ['href']
    href: '#'
    template: options.fn
    controller: this
    click: (event) ->
      event.preventDefault()

      if collection = @get('controller.' + path)
        collection.pushObject({})
  )

  Ember.Handlebars.helpers.view.call(this, view, options)
)

getSettingsPath = (view) ->
  settingsPaths = []
  if settingsPath = view.get('settingsPath')
    settingsPaths.pushObject settingsPath

  parent = view
  while parent = parent.get('parentView')
    if settingsPath = parent.get('settingsPath')
      settingsPaths.pushObject settingsPath

  return settingsPaths.reverse().join('.')

Ember.Handlebars.helper('settings-input', (options) ->
  view = options.data.view

  if options.hash.type == 'checkbox'
    originalPath = options.hash.checked
  else
    originalPath = options.hash.value

  parentsPath = getSettingsPath(view)
  #TODO: such checks should also check parents, not only current context view
  if !view.get('multiplier') && parentsPath && parentsPath != ''
    originalPath = parentsPath + '.' + originalPath

  fullPath = originalPath

  if view.get('multiplier')
    fullPath = 'view.content.' + fullPath

  if options.hash.type != 'password'
    createObjects.call(this, fullPath, 1)
  else
    createObjects.call(view, fullPath, 2)
    content = view.get('content')
    fullPath += ".value"
    if Ember.isNone(Ember.get(content, originalPath))
      Ember.set(content, originalPath, {})
    Ember.set(content, originalPath + ".type", 'password')

  if options.hash.type == 'checkbox'
    options.hash.checked = fullPath
  else
    options.hash.value = fullPath
  Ember.Handlebars.helpers.input.call(this, options)
)

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Ember.registerBoundHelper 'capitalize', (value, options) ->
  if value?
    safe $.capitalize(value)
  else
    ''

Ember.registerBoundHelper 'formatTime', (value, options) ->
  safe Travis.Helpers.timeAgoInWords(value) || '-'

Ember.registerBoundHelper 'formatDuration', (duration, options) ->
  safe Travis.Helpers.timeInWords(duration)

Ember.Handlebars.helper('formatCommit', (commit) ->
  safe Travis.Helpers.formatCommit(commit.get('sha'), commit.get('branch')) if commit
, 'sha', 'branch')

Ember.registerBoundHelper 'formatSha', (sha, options) ->
  safe Travis.Helpers.formatSha(sha)

Ember.registerBoundHelper 'pathFrom', (url, options) ->
  safe Travis.Helpers.pathFrom(url)

Ember.Handlebars.helper 'formatMessage', (message, options) ->
  safe Travis.Helpers.formatMessage(message, options.hash)

Ember.registerBoundHelper 'formatConfig', (config, options) ->
  safe Travis.Helpers.formatConfig(config)

Ember.registerBoundHelper 'formatLog', (log, options) ->
  parentView =  @get 'parentView'
  repo = parentView.get(options.repo)
  item = parentView.get(options.item)
  Travis.Helpers.formatLog(log, repo, item) || ''

