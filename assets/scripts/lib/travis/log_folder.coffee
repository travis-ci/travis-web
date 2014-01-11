class Travis.LogFolder
  constructor: (@element) ->
    @element.on 'click', '.fold', (event) =>
      target = $(event.target).closest('.fold')
      target.toggleClass('open')

      event.preventDefault()
      false
