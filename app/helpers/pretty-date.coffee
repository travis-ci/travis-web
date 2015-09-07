`import { timeAgoInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  safe moment(params[0]).format('MMMM D, YYYY H:mm:ss') || '-'

`export default helper`
