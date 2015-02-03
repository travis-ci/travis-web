`import { timeAgoInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (value, options) ->
  safe timeAgoInWords(value) || '-'

`export default helper`
