# TODO: revisit those patterns
FOLDS = [
  Em.Object.create(name: 'schema',  startPattern: /^\$ (?:bundle exec )?rake( db:create)? db:schema:load/, endPattern: /^(<\/span>)?\$/)
  Em.Object.create(name: 'migrate', startPattern: /^\$ (?:bundle exec )?rake( db:create)? db:migrate/, endPattern: /^(<\/span>)?\$/)
  Em.Object.create(name: 'bundle',  startPattern: /^\$ bundle install/, endPattern: /^(<\/span>)?\$/)
]

@Travis.Log = Em.Object.extend
  init: ->
    @set 'folds', []
    @set 'line', 1
    @initial = true

    for fold in FOLDS
      @addFold fold

  append: (lines) ->
    log   = @join lines
    log   = @escape log
    log   = @deansi log
    lines = @split log

    target       = @get 'target'
    index        = 0
    currentFold  = @currentFold

    @set 'lineNumber', 1 unless @get 'lineNumber'

    result = []

    for line in lines
      if line == '\r'
        @set 'replace', true
      else if line == '\n'
        @set 'newline', true
        index += 1
      else
        if currentFold && ( @isFoldEnding(currentFold, line) )
          # end of the fold, send fold to target
          if result.length > 0
            result.slice(-1)[0].foldEnd = true
            target.appendLog result

          @currentFold = currentFold = null
          @set 'foldContinuation', false
          result = []

        if !currentFold && ( currentFold = @foldByStart(line) )
          # beginning new fold, send current lines to target
          if result.length > 0
            target.appendLog result

          result = []
          start = index

        payload = { content: line }

        if currentFold
          payload.fold = currentFold.get('name')

        if @get 'foldContinuation'
          payload.foldContinuation = true

        payload.number = @get('lineNumber') + index

        if @get 'replace'
          @set 'replace', false
          payload.replace = true
        else if @get 'newline'
          @set 'newline', false
        else if !@initial
          payload.append = true

        @initial = false

        if payload.foldContinuation && payload.content.match(/Done. Build script exited with:/)
          # script ended, but fold is still closed, which most probably means
          # error, end the fold and open it.
          # TODO: we need log marks to make it easier
          payload.foldContinuation = null
          payload.openFold = payload.fold
          payload.fold = null

        result.pushObject payload

        if currentFold
          @set 'foldContinuation', true

    if result.length > 0
      if currentFold
        @currentFold = currentFold

      target.appendLog result

    nextLineNumber = @get('lineNumber') + index
    @set 'lineNumber', nextLineNumber

  join: (lines) ->
    if typeof lines == 'string'
      lines
    else
      lines.toArray().join ''

  split: (log) ->
    log = log.replace /\r\n/g, '\n'
    lines = log.split(/(\n)/)

    if lines.slice(-1)[0] == ''
      lines.popObject()

    result = []
    for line in lines
      result.pushObjects line.split(/(\r)/)

    result

  escape: (log) ->
    Handlebars.Utils.escapeExpression log

  deansi: (log) ->
    log = log.replace(/\r\r/g, '\r')
             .replace(/\033\[K\r/g, '\r')
             .replace(/\[2K/g, '')
             .replace(/\033\(B/g, '')
             .replace(/\033\[\d+G/, '')

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

  addFold: (fold) ->
    @get('folds').pushObject fold

  foldByStart: (line) ->
    @get('folds').find (fold) -> line.match(fold.get('startPattern'))

  isFoldEnding: (fold, line) ->
    line.match(fold.get('endPattern'))
