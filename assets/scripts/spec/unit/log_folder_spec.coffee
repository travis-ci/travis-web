element = jQuery('<div id="fakeLog">
  <p>first line</p>
  <div class="fold">
    <p>second line</p>
    <p>third line</p>
  </div>
  <p>fourth line</p>
</div>')

module "Travis.LogFolder",
  setup: ->
    jQuery('body').append(element)
    new Travis.LogFolder jQuery('#fakeLog')

  teardown: ->
    element.remove()

test "displays the fold", ->
  equal($('#fakeLog .fold.open').length, 0)
  $('#fakeLog .fold').click()
  equal($('#fakeLog .fold.open').length, 1)

test "hides the fold", ->
  $('#fakeLog .fold').addClass('open')
  $('#fakeLog .fold').click()
  equal($('#fakeLog .fold.open').length, 0)

test "binds new elements", ->
  new_element = jQuery('<div class="fold">
    <p>fifth line</p>
  </div>')
  jQuery('#fakeLog').append new_element

  equal($('#fakeLog .fold.open').length, 0)
  $('#fakeLog .fold').click()
  equal($('#fakeLog .fold.open').length, 2)
