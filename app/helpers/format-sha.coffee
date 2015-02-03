`import { formatSha as _formatSha, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (sha) ->
  safe _formatSha(sha)

`export default helper`
