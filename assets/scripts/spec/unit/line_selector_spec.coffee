fakeLocation = {}
fakeScroll =
  tryScroll: sinon.spy()

element = jQuery('<div id="fakeLog">
  <p><a></a>first line</p>
  <p><a></a>second line</p>
  <p><a></a>third line</p>
</div>')

module "Travis.LinesSelector",
  setup: ->
    fakeLocation.hash = ''
    jQuery('body').append(element)

  teardown: ->
    element.remove()

test "defaults to no line selected", ->
  Ember.run ->
    new Travis.LinesSelector(element, fakeScroll, fakeLocation)

  wait().then ->
    equal($('#fakeLog p.highlight').length, 0)

test "defaults to a single line selected", ->
  fakeLocation.hash = '#L2'
  Ember.run ->
    new Travis.LinesSelector(element, fakeScroll, fakeLocation)

  wait().then ->
    equal($('#fakeLog p.highlight').length, 1)
    equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true)

test "defaults to multiple lines selected", ->
  fakeLocation.hash = '#L2-L3'
  Ember.run ->
    new Travis.LinesSelector(element, fakeScroll, fakeLocation)

  wait().then ->
    equal($('#fakeLog p.highlight').length, 2)
    equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true)
    equal($('#fakeLog p:nth-child(3)').hasClass('highlight'), true)

test "selects a single line", ->
  Ember.run ->
    new Travis.LinesSelector(element, fakeScroll, fakeLocation)

  wait().then ->
    equal($('#fakeLog p.highlight').length, 0)
    $('#fakeLog p:first a').click()
    equal($('#fakeLog p.highlight').length, 1)
    equal($('#fakeLog p:nth-child(1)').hasClass('highlight'), true)
    equal('#L1', fakeLocation.hash)

test "selects multiple lines", ->
  fakeLocation.hash = '#L2'
  Ember.run ->
    new Travis.LinesSelector(element, fakeScroll, fakeLocation)
  wait().then ->
    equal($('#fakeLog p.highlight').length, 1)

    event = jQuery.Event('click')
    event.shiftKey = true
    $('#fakeLog p:first a').trigger(event)

    equal($('#fakeLog p.highlight').length, 2)
    equal($('#fakeLog p:nth-child(1)').hasClass('highlight'), true)
    equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true)
    equal('#L1-L2', fakeLocation.hash)
