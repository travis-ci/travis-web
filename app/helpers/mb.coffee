helper = Ember.Handlebars.makeBoundHelper (size) ->
  if size
    (size / 1024 / 1024).toFixed(2)

`export default helper`
