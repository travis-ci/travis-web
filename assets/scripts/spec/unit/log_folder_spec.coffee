element = jQuery('<div id="fakeLog">
  <p>first line</p>
  <div class="fold">
    <p>second line</p>
    <p>third line</p>
  </div>
  <p>fourth line</p>
</div>')
logFolder = null

module "Travis.LogFolder",
  setup: ->
    jQuery('body').append(element)
    logFolder = new Travis.LogFolder jQuery('#fakeLog')

  teardown: ->
    element.remove()

test "displays the fold", ->
  equal($('#fakeLog .fold.open').length, 0)
  $('#fakeLog .fold p:first').click()
  equal($('#fakeLog .fold.open').length, 1)

test "hides the fold", ->
  $('#fakeLog .fold').addClass('open')
  $('#fakeLog .fold p:first').click()
  equal($('#fakeLog .fold.open').length, 0)

test "binds new elements", ->
  new_element = jQuery('<div class="fold">
    <p>fifth line</p>
  </div>')
  jQuery('#fakeLog').append new_element

  equal($('#fakeLog .fold.open').length, 0)
  $('#fakeLog .fold p:first-child').click()
  equal($('#fakeLog .fold.open').length, 2)

test "fold", ->
  fold = jQuery('#fakeLog .fold')
  line = fold.find('p:first')
  fold.addClass('open')

  equal(fold.hasClass('open'), true)
  logFolder.fold(line)
  equal(fold.hasClass('open'), false)

test "unfold", ->
  fold = jQuery('#fakeLog .fold')
  line = fold.find('p:first')

  equal(fold.hasClass('open'), false)
  logFolder.unfold(line)
  equal(fold.hasClass('open'), true)
