timeAgoInWords = Travis.Helpers.timeAgoInWords
safe = Travis.Helpers.safe

formatTime = (value, options) ->
  safe timeAgoInWords(value) || '-'

Travis.Handlebars.formatTime = formatTime
