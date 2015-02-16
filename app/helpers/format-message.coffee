`import { formatMessage as _formatMessage, safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (message, options) ->
  safe _formatMessage(message, options.hash)

`export default helper`
