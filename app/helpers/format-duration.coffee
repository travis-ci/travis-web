timeInWords = Travis.Helpers.timeInWords
safe = Travis.Helpers.safe

formatDuration = (duration, options) ->
  safe timeInWords(duration)

Travis.Handlebars.formatDuration = formatDuration
