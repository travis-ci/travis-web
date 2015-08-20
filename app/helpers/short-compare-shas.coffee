`import { pathFrom } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Helper.helper (params) ->
  url = params[0]
  path = pathFrom(url)
  if path.indexOf('...') >= 0
    shas = path.split('...')
    "#{shas[0][0..6]}..#{shas[1][0..6]}"
  else
    path

`export default helper`
