fn = (size) ->
  if size
    (size / 1024 / 1024).toFixed(2)

Travis.Handlebars.mb = fn
