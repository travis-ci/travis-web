import Ember from 'ember';
import FaviconManager from 'travis/utils/favicon-manager';

var fakeHead, manager;

module("Favicon manager", {
  beforeEach() {
    fakeHead = $('<div id="fake-head"></div>').appendTo($('#qunit-fixture'));
    return manager = new FaviconManager(fakeHead[0]);
  },
  afterEach() {
    fakeHead.remove();
    return manager = null;
  }
});

test('use <head> tag by default', function() {
  manager = new FaviconManager();
  return equal(manager.getHeadTag(), $('head')[0]);
});

test('set favicon if there is no link tag in head', function() {
  var link;
  equal(fakeHead.find('link').length, 0, 'there should be no link tags initially');
  manager.setFavicon('foobar');
  link = fakeHead.find('link')[0];
  ok(link, 'link tag should be added by favicon manager');
  stop();
  return setTimeout(function() {
    start();
    equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
    equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
    return equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
  }, 20);
});

test('replace exisiting link tag', function() {
  var link, links;
  fakeHead.append($('<link id="foo" rel="icon"></link>'));
  ok('foo', fakeHead.find('link').attr('id'), 'initially link should exist');
  manager.setFavicon('foobar');
  links = fakeHead.find('link');
  equal(links.length, 1, 'there should be only one link in head');
  link = links[0];
  ok(!link.getAttribute('id'), 'existing link should be replaced with a new one');
  stop();
  return setTimeout(function() {
    start();
    equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
    equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
    return equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
  }, 20);
});

test('find link with rel=icon only', function() {
  fakeHead.append($('<link id="foo" rel="foo"></link>'));
  return ok(!manager.getLinkTag());
});
