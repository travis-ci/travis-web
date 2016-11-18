import Ember from 'ember';
import FaviconManager from 'travis/utils/favicon-manager';

var fakeHead, manager;

const { module, test } = QUnit;

module('Favicon manager', {
  beforeEach() {
    fakeHead = Ember.$('<div id="fake-head"></div>').appendTo(Ember.$('#qunit-fixture'));
    return manager = new FaviconManager(fakeHead[0]);
  },
  afterEach() {
    fakeHead.remove();
    return manager = null;
  }
});

test('use <head> tag by default', function (assert) {
  manager = new FaviconManager();
  assert.equal(manager.getHeadTag(), Ember.$('head')[0]);
});

test('set favicon if there is no link tag in head', function (assert) {
  let done = assert.async();
  assert.equal(fakeHead.find('link').length, 0, 'there should be no link tags initially');
  manager.setFavicon('foobar');
  let link = fakeHead.find('link')[0];
  assert.ok(link, 'link tag should be added by favicon manager');
  return setTimeout(function () {
    assert.equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
    assert.equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
    assert.equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
    done();
  }, 20);
});

test('replace existing link tag', function (assert) {
  let done = assert.async();
  fakeHead.append(Ember.$('<link id="foo" rel="icon"></link>'));
  assert.ok('foo', fakeHead.find('link').attr('id'), 'initially link should exist');
  manager.setFavicon('foobar');
  const links = fakeHead.find('link');
  assert.equal(links.length, 1, 'there should be only one link in head');
  const link = links[0];
  assert.ok(!link.getAttribute('id'), 'existing link should be replaced with a new one');
  return setTimeout(function () {
    assert.equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
    assert.equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
    assert.equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
    done();
  }, 20);
});

test('find link with rel=icon only', function (assert) {
  fakeHead.append(Ember.$('<link id="foo" rel="foo"></link>'));
  assert.notOk(manager.getLinkTag());
});
