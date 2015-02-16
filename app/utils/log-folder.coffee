class LogFolder
  constructor: (@element) ->
    @element.on 'click', '.fold', (event) =>
      folder = @getFolderFromLine $(event.target)
      @toggle folder

      event.preventDefault()
      false

  fold: (line) ->
    folder = @getFolderFromLine(line)
    if folder.hasClass('open')
      @toggle(folder)

  unfold: (line) ->
    folder = @getFolderFromLine(line)
    unless folder.hasClass('open')
      @toggle(folder)

  toggle: (folder) ->
    folder.toggleClass('open')

  getFolderFromLine: (line) ->
    line.parent('.fold')

`export default LogFolder`
