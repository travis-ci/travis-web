`import { formatSha as _formatSha, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Helper.helper (params) ->
  safe _formatSha(params[0])

`export default helper`
