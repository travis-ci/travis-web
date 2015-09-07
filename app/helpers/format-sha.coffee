`import { formatSha as _formatSha, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.HTMLBars.makeBoundHelper (params) ->
  safe _formatSha(params[0])

`export default helper`
