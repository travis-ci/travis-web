`import { timeAgoInWords, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Helper.helper (params) ->
  safe moment(params[0]).format('MMMM D, YYYY H:mm:ss') || '-'

`export default helper`
