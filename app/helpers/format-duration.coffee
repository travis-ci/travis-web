`import { timeInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (duration, options) ->
  safe timeInWords(duration)

`export default helper`
