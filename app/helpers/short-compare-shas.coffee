pathFrom = Travis.Helpers.pathFrom

fn = (url, options) ->
  path = pathFrom(url)
  if path.indexOf('...') >= 0
    shas = path.split('...')
    "#{shas[0][0..6]}..#{shas[1][0..6]}"
  else
    path

Travis.Handlebars.shortCompareShas = fn
