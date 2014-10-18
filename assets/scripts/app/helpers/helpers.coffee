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
    config = $.only config, Object.keys(Travis.CONFIG_KEYS_MAP)
    values = $.map config, (value, key) ->
      value = (if value && value.join then value.join(', ') else value) || ''
      if key == 'rvm' && "#{value}".match(/^\d+$/)
        value = "#{value}.0"
      '%@: %@'.fmt Travis.CONFIG_KEYS_MAP[key], value
    if values.length == 0 then '-' else values.join(', ')

  formatMessage: (message, options) ->
    message = message || ''
    message = message.split(/\n/)[0]  if options.short
    message = @_emojize(@_escape(message))
    if !!options.repo
      message = @githubify(message, options.repo.get('owner'), options.repo.get('name'))
    if !!options.pre
      message = message.replace /\n/g, '<br/>'
    message

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

  githubify: (text, owner, repo) ->
    self = this
    text = text.replace @_githubReferenceRegexp, (reference, matchedOwner, matchedRepo, matchedNumber) ->
      self._githubReferenceLink(reference, { owner: owner, repo: repo }, { owner: matchedOwner, repo: matchedRepo, number: matchedNumber } )
    text = text.replace @_githubUserRegexp, (reference, username) ->
      self._githubUserLink(reference, username)
    text = text.replace @_githubCommitReferenceRegexp, (reference, matchedOwner, matchedRepo, matchedSHA) ->
      self._githubCommitReferenceLink(reference, { owner: owner, repo: repo }, { owner: matchedOwner, repo: matchedRepo, sha: matchedSHA })
    text

  _githubReferenceRegexp: new RegExp("([\\w-]+)?\\/?([\\w-]+)?(?:#|gh-)(\\d+)", 'g')

  _githubReferenceLink: (reference, current, matched) ->
    owner = matched.owner || current.owner
    repo = matched.repo || current.repo
    "<a href=\"#{Travis.config.source_endpoint}/#{owner}/#{repo}/issues/#{matched.number}\">#{reference}</a>"

  _githubUserRegexp: new RegExp("\\B@([\\w-]+)", 'g')

  _githubUserLink: (reference, username) ->
    "<a href=\"#{Travis.config.source_endpoint}/#{username}\">#{reference}</a>"

  _githubCommitReferenceRegexp: new RegExp("([\\w-]+)?\\/([\\w-]+)?@([0-9A-Fa-f]+)", 'g')

  _githubCommitReferenceLink: (reference, current, matched) ->
    owner = matched.owner || current.owner
    repo = matched.repo || current.repo
    "<a href=\"https://github.com/#{owner}/#{repo}/commit/#{matched.sha}\">#{reference}</a>"

  _normalizeDateString: (string) ->
    if window.JHW
      string = string.replace('T', ' ').replace(/-/g, '/')
      string = string.replace('Z', '').replace(/\..*$/, '')
    string

  _nowUtc: ->
    @_toUtc Travis.currentDate()

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

  configKeys: (config) ->
    return [] unless config
    $.intersect($.keys(config), Object.keys(Travis.CONFIG_KEYS_MAP))
