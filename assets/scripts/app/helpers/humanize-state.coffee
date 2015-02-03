safe = Travis.Helpers.safe

fn = (state) ->
  if state == 'received'
    'booting'
  else
    state


Travis.Handlebars.humanizeState = fn
