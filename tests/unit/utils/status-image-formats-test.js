import format from 'travis/utils/status-image-formats';

module('Status image formats');

test('it generates CCTray url with a slug', () => {
  let url;
  url = format('CCTray', 'travis-ci/travis-web');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml');
});

test('it generates CCTray url with a slug and a branch', () => {
  let url;
  url = format('CCTray', 'travis-ci/travis-web', 'development');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml?branch=development');
});
