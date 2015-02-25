`import Ember from 'ember'`
`import FaviconManager from 'travis/utils/favicon-manager'`

manager = null
fakeHead = null

module("Favicon manager",
  beforeEach: ->
    fakeHead = $('<div id="fake-head"></div>').appendTo($('#qunit-fixture'))
    manager = new FaviconManager(fakeHead[0])
  afterEach: ->
    fakeHead.remove()
    manager = null
)

test 'use <head> tag by default', ->
  manager = new FaviconManager()
  equal manager.getHeadTag(), $('head')[0]

test 'set favicon if there is no link tag in head', ->
  equal fakeHead.find('link').length, 0, 'there should be no link tags initially'

  manager.setFavicon('foobar')

  link = fakeHead.find('link')[0]

  ok link, 'link tag should be added by favicon manager'
  equal link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set'
  equal link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set'
  equal link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set'

test 'replace exisiting link tag', ->
  fakeHead.append($('<link id="foo" rel="icon"></link>'))

  ok 'foo', fakeHead.find('link').attr('id'), 'initially link should exist'

  manager.setFavicon('foobar')

  links = fakeHead.find('link')
  equal links.length, 1, 'there should be only one link in head'

  link = links[0]

  ok !link.getAttribute('id'), 'existing link should be replaced with a new one'
  equal link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set'
  equal link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set'
  equal link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set'

test 'find link with rel=icon only', ->
  fakeHead.append($('<link id="foo" rel="foo"></link>'))
  ok !manager.getLinkTag()
