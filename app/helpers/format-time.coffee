`import { timeAgoInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  safe timeAgoInWords(params[0]) || '-'

`export default helper`
