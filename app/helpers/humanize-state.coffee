`import { safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (state) ->
  if state == 'received'
    'booting'
  else
    state

`export default helper`
