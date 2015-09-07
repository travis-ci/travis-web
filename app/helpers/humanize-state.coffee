`import { safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  state = params[0]
  if state == 'received'
    'booting'
  else
    state

`export default helper`
