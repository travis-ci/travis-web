`import { timeAgoInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (value, options) ->
  safe moment(value).format('MMMM D, YYYY H:mm:ss') || '-'

`export default helper`
