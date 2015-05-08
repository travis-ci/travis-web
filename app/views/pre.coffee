`import LinesSelector from 'travis/utils/lines-selector'`
`import LogFolder from 'travis/utils/log-folder'`
`import config from 'travis/config/environment'`
`import { plainTextLog as plainTextLogUrl } from 'travis/utils/urls'`
`import BasicView from 'travis/views/basic'`

Log.DEBUG = false
Log.LIMIT = 10000

Log.Scroll = (options) ->
  options ||= {}
  @beforeScroll = options.beforeScroll
  this
Log.Scroll.prototype = $.extend new Log.Listener,
  insert: (log, data, pos) ->
    @tryScroll() if @numbers
    true

  tryScroll: ->
    if element = $("#log p:visible.highlight:first")
      if @beforeScroll
        @beforeScroll()
      $('#main').scrollTop(0)
      $('html, body').scrollTop(element.offset()?.top - (window.innerHeight / 3)) # weird, html works in chrome, body in firefox

View = BasicView.extend
  templateName: 'jobs/pre'
  currentUserBinding: 'controller.currentUser.model'

  logWillChange: (->
    console.log 'log view: log will change' if Log.DEBUG
    @teardownLog()
  ).observesBefore('log')

  didInsertElement: ->
    console.log 'log view: did insert' if Log.DEBUG
    @_super.apply this, arguments
    @createEngine()

  willDestroyElement: ->
    console.log 'log view: will destroy' if Log.DEBUG
    @teardownLog()

  versionDidChange: (->
    @rerender() if @get('_state') == 'inDOM'
  ).observes('log.version')

  logDidChange: (->
    console.log 'log view: log did change: rerender' if Log.DEBUG

    if @get('log')
      @createEngine()
      @rerender() if @get('_state') == 'inDOM'
  ).observes('log')

  teardownLog: ->
    if log = @get('log')
      parts = log.get('parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
      parts.destroy()
      log.notifyPropertyChange('parts')
      @lineSelector?.willDestroy()

  createEngine: ->
    if @get('log')
      console.log 'log view: create engine' if Log.DEBUG
      @scroll = new Log.Scroll beforeScroll: =>
        @unfoldHighlight()
      @engine = Log.create(limit: Log.LIMIT, listeners: [@scroll])
      @logFolder = new LogFolder(@$().find('#log'))
      @lineSelector = new LinesSelector(@$().find('#log'), @scroll, @logFolder)
      @observeParts()

  unfoldHighlight: ->
    @lineSelector.unfoldLines()

  observeParts: ->
    if log = @get('log')
      parts = log.get('parts')
      parts.addArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
      parts = parts.slice(0)
      @partsDidChange(parts, 0, null, parts.length)

  partsDidChange: (parts, start, _, added) ->
    console.log 'log view: parts did change' if Log.DEBUG
    for part, i in parts.slice(start, start + added)
      # console.log "limit in log view: #{@get('limited')}"
      break if @get('limited')
      @engine.set(part.number, part.content)
      @propertyDidChange('limited')

  limited: (->
    @engine?.limit?.limited
  ).property()

  plainTextLogUrl: (->
    if id = @get('log.job.id')
      url = plainTextLogUrl(id)
      if config.pro
        url += "&access_token=#{@get('job.log.token')}"
      url
  ).property('job.log.id', 'job.log.token')

  hasPermission: (->
    if permissions = @get('currentUser.permissions')
      permissions.contains parseInt(@get('job.repo.id'))
  ).property('currentUser.permissions.length', 'job.repo.id')

  canRemoveLog: (->
    if job = @get('job')
      job.get('canRemoveLog') && @get('hasPermission')
  ).property('job.canRemoveLog', 'hasPermission')

  showToTop: (->
    @get('log.hasContent') && @get('job.canRemoveLog')
  ).property('log.hasContent', 'job.canRemoveLog')
  showTailing: Ember.computed.alias('showToTop')

  actions:
    toTop: () ->
      Travis.tailing.stop()
      $(window).scrollTop(0)

    toggleTailing: ->
      Travis.tailing.toggle()
      @engine.autoCloseFold = !Travis.tailing.isActive()
      event.preventDefault()

    removeLogPopup: ->
      if @get('canRemoveLog')
        @popup('remove-log-popup')
        return false

  noop: -> # TODO required?

`export default View`
Travis.PreView = View
