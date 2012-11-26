require 'travis/log'
require 'config/emoij'

@Travis.Helpers =
  COLORS:
    default:  'yellow'
    passed:   'green'
    failed:   'red'
    errored:  'gray'
    canceled: 'gray'

  compact: (object) ->
    result = {}
    (result[key] = value unless $.isEmpty(value)) for key, value of object || {}
    result

  safe: (string) ->
    new Handlebars.SafeString(string)

  colorForState: (state) ->
    Travis.Helpers.COLORS[state] || Travis.Helpers.COLORS['default']

  formatCommit: (sha, branch) ->
    Travis.Helpers.formatSha(sha) + if branch then " (#{branch})" else ''

  formatSha: (sha) ->
    (sha || '').substr(0, 7)

  formatConfig: (config) ->
    config = $.only config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl', 'compiler'
    values = $.map config, (value, key) ->
      value = (if value && value.join then value.join(', ') else value) || ''
      '%@: %@'.fmt $.camelize(key), value
    if values.length == 0 then '-' else values.join(', ')

  formatMessage: (message, options) ->
    message = message || ''
    message = message.split(/\n/)[0]  if options.short
    @_emojize(@_escape(message)).replace /\n/g, '<br/>'

  formatLog: (log, repo, item) ->
    event = if item.constructor == Travis.Build
      'showBuild'
    else
      'showJob'

    url = Travis.app.get('router').urlForEvent(event, repo, item)

    Travis.Log.filter(log, url)

  pathFrom: (url) ->
    (url || '').split('/').pop()

  timeAgoInWords: (date) ->
    $.timeago.distanceInWords date

  durationFrom: (started, finished) ->
    started = started and @_toUtc(new Date(@_normalizeDateString(started)))
    finished = if finished then @_toUtc(new Date(@_normalizeDateString(finished))) else @_nowUtc()
    if started && finished then Math.round((finished - started) / 1000) else 0

  timeInWords: (duration) ->
    days = Math.floor(duration / 86400)
    hours = Math.floor(duration % 86400 / 3600)
    minutes = Math.floor(duration % 3600 / 60)
    seconds = duration % 60

    if days > 0
      'more than 24 hrs'
    else
      result = []
      result.push hours + ' hr'  if hours is 1
      result.push hours + ' hrs'  if hours > 1
      result.push minutes + ' min'  if minutes > 0
      result.push seconds + ' sec'  if seconds > 0
      if result.length > 0 then result.join(' ') else '-'

  _normalizeDateString: (string) ->
    if window.JHW
      string = string.replace('T', ' ').replace(/-/g, '/')
      string = string.replace('Z', '').replace(/\..*$/, '')
    string

  _nowUtc: ->
    @_toUtc new Date()

  _toUtc: (date) ->
    Date.UTC date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()

  _emojize: (text) ->
    emojis = text.match(/:\S+?:/g)
    if emojis isnt null
      $.each emojis.uniq(), (ix, emoji) ->
        strippedEmoji = emoji.substring(1, emoji.length - 1)
        unless EmojiDictionary.indexOf(strippedEmoji) is -1
          image = '<img class=\'emoji\' title=\'' + emoji + '\' alt=\'' + emoji + '\' src=\'' + '/images/emoji/' + strippedEmoji + '.png\'/>'
          text = text.replace(new RegExp(emoji, 'g'), image)
    text

  _escape: (text) ->
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace />/g, '&gt;'

