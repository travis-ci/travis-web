safe = Travis.Helpers.safe

capitalize = (value, options) ->
  if value?
    safe $.capitalize(value)
  else
    ''

Travis.Handlebars.capitalize = capitalize
