`import { formatMessage as _formatMessage, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Helper.helper (params, hash) ->
  safe _formatMessage(params[0], hash)

`export default helper`
