`import { timeInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Helper.helper (params) ->
  safe timeInWords(params[0])

`export default helper`
