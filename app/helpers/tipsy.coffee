`import { safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

`export default helper`
