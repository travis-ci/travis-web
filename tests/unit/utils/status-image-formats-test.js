import Ember from 'ember';
import format from 'travis/utils/status-image-formats';
import config from 'travis/config/environment';

module('Status image formats');

test('it generates CCTray url with a slug', function() {
  var url;
  url = format('CCTray', 'travis-ci/travis-web');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml');
});

test('it generates CCTray url with a slug and a branch', function() {
  var url;
  url = format('CCTray', 'travis-ci/travis-web', 'development');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml?branch=development');
});
