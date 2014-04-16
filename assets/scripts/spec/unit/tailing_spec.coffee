fakeWindow =
  scroll: sinon.spy()
  scrollTop: sinon.stub().returns(0)
  height: sinon.stub().returns(40)
element = jQuery('<div id="specTail"></div>')
log     = jQuery('<div id="specLog"></div>')
tail = new Travis.Tailing(fakeWindow, '#specTail', '#specLog')
tail.tail = -> element
tail.log  = -> log

module "Travis.Tailing",
  setup: ->
    jQuery('body').append(element)
    jQuery('body').append(log)

  teardown: ->
    element.remove()
    log.remove()
    tail.stop()

#test "toggle", ->
#  equal(element.hasClass('active'), false)
#  tail.toggle()
#  equal(element.hasClass('active'), true)
#  tail.toggle()
#  stop()
#
#  Ember.run.later ->
#    start()
#    equal(element.hasClass('active'), false)
#  , 300
#
#test "active", ->
#  equal(tail.active(), false)
#  element.addClass('active')
#  equal(tail.active(), true)
#
#test "autoscroll when inactive", ->
#  tail.scrollTo = sinon.spy()
#
#  equal(tail.active(), false)
#  equal(tail.autoScroll(), false)
#  equal(tail.scrollTo.called, false)
#
#test "autoscroll", ->
#  element.addClass('active')
#  log.offset = -> {top: 1}
#  log.outerHeight = -> 1
#
#  equal(tail.active(), true)
#  equal(tail.autoScroll(), true)
#  equal(fakeWindow.scrollTop.calledWith(2), true)
#
#test "autoscroll when we're at the bottom", ->
#  element.addClass('active')
#  log.offset = -> {top: 0}
#  log.outerHeight = -> 0
#
#  equal(tail.active(), true)
#  equal(tail.autoScroll(), false)
#  equal(fakeWindow.scrollTop.calledWith(0), false)
#
#test 'should stop scrolling if the position changed', ->
#  element.addClass('active')
#  tail.position = 100
#  tail.onScroll()
#  equal(element.hasClass('active'), false)
#
#test 'positionButton adds the scrolling class', ->
#  log.offset = -> {top: -1}
#
#  tail.positionButton()
#  equal(element.hasClass('scrolling'), true)
#  equal(element.hasClass('bottom'), false)
#
#test 'positionButton removes the scrolling class', ->
#  log.offset = -> {top: 1}
#  tail.positionButton()
#  equal(element.hasClass('scrolling'), false)
#  equal(element.hasClass('bottom'), false)
#
#test 'positionButton sets the button as bottom', ->
#  log.offset  = -> {top: -100}
#  log.height  = -> 50
#  tail.height = -> 1
#
#  tail.positionButton()
#  equal(element.hasClass('scrolling'), false)
#  equal(element.hasClass('bottom'), true)
