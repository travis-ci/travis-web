`import Ember from "ember"`

fn = (size) ->
  if size
    (size / 1024 / 1024).toFixed(2)

`export default Ember.Helper.helper(fn)`
