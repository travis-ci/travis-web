`import { timeInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  safe timeInWords(params[0])

`export default helper`
