I18n.missingTranslation = ->
  key = arguments[arguments.length - 1]
  value = key.split('.').pop()
  $.titleize(value)

