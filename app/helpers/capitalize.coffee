`import { safe } from 'travis/utils/helpers'`
`import Ember from "ember"`

helper = Ember.Handlebars.makeBoundHelper (value, options) ->
  if value?
    safe $.capitalize(value)
  else
    ''

`export default helper`
