@Travis.Log =
  FOLDS:
    schema: /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:schema:load[\s\S]*?<p.*?\/a>-- assume_migrated_upto_version[\s\S]*?<\/p>\n<p.*?\/a>.*<\/p>)/g
    migrate: /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:migrate[\s\S]*== +\w+: migrated \(.*\) =+)/g
    bundle: /(<p.*?\/a>\$ bundle install.*<\/p>\n(<p.*?\/a>(Updating|Using|Installing|Fetching|remote:|Receiving|Resolving).*?<\/p>\n|<p.*?\/a><\/p>\n)*)/g
    exec: /(<p.*?\/a>[\/\w]*.rvm\/rubies\/[\S]*?\/(ruby|rbx|jruby) .*?<\/p>)/g

  filter: (log) ->
    log = @escape(log)
    log = @deansi(log)
    log = log.replace(/\r/g, '')
    log = @number(log)
    log = @fold(log)
    log = log.replace(/\n/g, '')
    log

  stripPaths: (log) ->
    log.replace /\/home\/vagrant\/builds(\/[^\/\n]+){2}\//g, ''

  escape: (log) ->
    Handlebars.Utils.escapeExpression log

  escapeRuby: (log) ->
    log.replace /#<(\w+.*?)>/, '#&lt;$1&gt;'

  number: (log) ->
    result = ''
    $.each log.trim().split('\n'), (ix, line) ->
      number = ix + 1
      path = Travis.Log.location().substr(1).replace(/\/L\d+/, '') + '/L' + number
      result += '<p><a href=\'#%@\' id=\'%@\' name=\'L%@\'>%@</a>%@</p>\n'.fmt(path, path, number, number, line)
    result.trim()

  deansi: (log) ->
    log = log.replace(/\r\r/g, '\r').replace(/\033\[K\r/g, '\r').replace(/^.*\r(?!$)/g, '').replace(/\[2K/g, '').replace(/\033\(B/g, '')
    ansi = ansiparse(log)
    text = ''
    ansi.forEach (part) ->
      classes = []
      part.foreground and classes.push(part.foreground)
      part.background and classes.push('bg-' + part.background)
      part.bold and classes.push('bold')
      part.italic and classes.push('italic')
      text += (if classes.length then ('<span class=\'' + classes.join(' ') + '\'>' + part.text + '</span>') else part.text)
    text.replace /\033/g, ''

  fold: (log) ->
    log = @unfold(log)
    $.each Travis.Log.FOLDS, (name, pattern) ->
      log = log.replace(pattern, ->
        '<div class=\'fold ' + name + '\'>' + arguments[1].trim() + '</div>'
      )
    log

  unfold: (log) ->
    log.replace /<div class='fold[^']*'>([\s\S]*?)<\/div>/g, '$1\n'

  location: ->
    window.location.hash

