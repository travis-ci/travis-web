/* global Travis, md5 */
import config from 'travis/config/environment';

var ccXml, email, githubAdmin, githubCommit, githubNetwork, githubPullRequest,
  githubRepo, githubWatchers, gravatarImage, plainTextLog, statusImage;

plainTextLog = function (id) {
  return config.apiEndpoint + '/jobs/' + id + '/log.txt?deansi=true';
};

githubPullRequest = function (slug, pullRequestNumber) {
  return config.sourceEndpoint + '/' + slug + '/pull/' + pullRequestNumber;
};

githubCommit = function (slug, sha) {
  return config.sourceEndpoint + '/' + slug + '/commit/' + sha;
};

githubRepo = function (slug) {
  return config.sourceEndpoint + '/' + slug;
};

githubWatchers = function (slug) {
  return config.sourceEndpoint + '/' + slug + '/watchers';
};

githubNetwork = function (slug) {
  return config.sourceEndpoint + '/' + slug + '/network';
};

githubAdmin = function (slug) {
  return config.sourceEndpoint + '/' + slug + '/settings/hooks#travis_minibucket';
};

statusImage = function (slug, branch) {
  var prefix = location.protocol + '//' + location.host;

  // the ruby app (waiter) does an indirect, internal redirect to api on build status images
  // but that does not work if you only run `ember serve`
  // so in development we use the api endpoint deireclty
  if (config.environment === 'development') {
    prefix = config.apiEndpoint;
  }

  let branchParam = branch ? `?branch=${encodeURIComponent(branch)}` : '';

  if (config.pro) {
    let token = Travis.__container__.lookup('controller:currentUser').get('model.token');
    let tokenParam = `?token=${token}`;
    return `${prefix}/${slug}.svg${tokenParam}${branchParam}`;
  } else {
    return `${prefix}/${slug}.svg${branchParam}`;
  }
};

ccXml = function (slug, branch) {
  var delimiter, token, url;
  url = '#' + config.apiEndpoint + '/repos/' + slug + '/cc.xml';
  if (branch) {
    url = url + '?branch=' + branch;
  }
  if (config.pro) {
    delimiter = url.indexOf('?') === -1 ? '?' : '&';
    token = Travis.__container__.lookup('controller:currentUser').get('model.token');
    url = '' + url + delimiter + 'token=' + token;
  }
  return url;
};

email = function (email) {
  return 'mailto:' + email;
};

gravatarImage = function (email, size) {
  return 'https://www.gravatar.com/avatar/' + (md5(email)) + '?s=' + size + '&d=blank';
};

export {
  plainTextLog,
  githubPullRequest,
  githubCommit,
  githubRepo,
  githubWatchers,
  githubNetwork,
  githubAdmin,
  statusImage,
  ccXml,
  email,
  gravatarImage
};
