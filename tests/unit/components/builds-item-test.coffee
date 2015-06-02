`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'builds-item', {
  needs: ['helper:format-sha', 'helper:format-duration', 'helper:format-time',
          'helper:format-message']
}

test 'it renders', (assert) ->
  assert.expect 2

  # creates the component instance
  component = @subject()
  assert.equal component._state, 'preRender'

  # renders the component to the page
  @render()
  assert.equal component._state, 'inDOM'
