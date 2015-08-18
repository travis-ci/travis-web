`import Ember from 'ember'`
`import LinesSelector from 'travis/utils/lines-selector'`
`import LogFolder from 'travis/utils/log-folder'`
`import config from 'travis/config/environment'`
`import { plainTextLog as plainTextLogUrl } from 'travis/utils/urls'`

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

Log.Limit = (max_lines, limitedLogCallback) ->
  @max_lines = max_lines || 1000
  @limitedLogCallback = limitedLogCallback || (->)
  this

Log.Limit.prototype = Log.extend new Log.Listener,
  count: 0,
  insert: (log, node, pos) ->
    if node.type == 'paragraph' && !node.hidden
      @count += 1
      if @limited
        @limitedLogCallback()
      return @count

Object.defineProperty Log.Limit.prototype, 'limited',
  get: ->
    @count >= @max_lines

LogContentComponent = Ember.Component.extend
  popup: Ember.inject.service()
  auth: Ember.inject.service()

  currentUserBinding: 'auth.currentUser'

  didInsertElement: ->
    console.log 'log view: did insert' if Log.DEBUG
    @_super.apply this, arguments
    @createEngine()

  willDestroyElement: ->
    console.log 'log view: will destroy' if Log.DEBUG
    @teardownLog()

  teardownLog: (log) ->
    if log || log = @get('log')
      parts = log.get('parts')
      parts.removeArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
      parts.destroy()
      log.notifyPropertyChange('parts')
      @lineSelector?.willDestroy()
      if logElement = this.$('#log')
        logElement.empty()

  createEngine: (log) ->
    if log || log = @get('log')
      if logElement = this.$('#log')
        logElement.empty()

      log.onClear =>
        @teardownLog()
        @createEngine()

      @scroll = new Log.Scroll beforeScroll: =>
        @unfoldHighlight()
      @limit = new Log.Limit Log.LIMIT, =>
        @set('limited', true)
      @engine = Log.create(listeners: [@scroll, @limit])
      @engine.limit = @limit
      @logFolder = new LogFolder(@$('#log'))
      @lineSelector = new LinesSelector(@$('#log'), @scroll, @logFolder)
      @observeParts(log)

  didUpdateAttrs: (changes) ->
    @_super.apply(this, arguments)

    return unless changes.oldAttrs

    if changes.newAttrs.job.value && changes.oldAttrs.job.value &&
       changes.newAttrs.job.value != changes.oldAttrs.job.value

      @teardownLog(changes.oldAttrs.job.value.get('log'))
      @createEngine(changes.newAttrs.job.value.get('log'))

  unfoldHighlight: ->
    @lineSelector.unfoldLines()

  observeParts: (log) ->
    if log || log = @get('log')
      parts = log.get('parts')
      parts.addArrayObserver(@, didChange: 'partsDidChange', willChange: 'noop')
      parts = parts.slice(0)
      @partsDidChange(parts, 0, null, parts.length)

  partsDidChange: (parts, start, _, added) ->
    console.log 'log view: parts did change' if Log.DEBUG
    return unless @get('state') == 'inDOM'

    for part, i in parts.slice(start, start + added)
      # console.log "limit in log view: #{@get('limited')}"
      break if @engine?.limit?.limited
      @engine.set(part.number, part.content)

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
        @get('popup').open('remove-log-popup')
        return false

  noop: -> # TODO required?

`export default LogContentComponent`
