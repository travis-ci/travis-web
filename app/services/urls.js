/* global md5 */
import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),

  plainTextLog(id) {
    return config.apiEndpoint + '/jobs/' + id + '/log.txt?deansi=true';
  },

  githubPullRequest(slug, pullRequestNumber) {
    return config.sourceEndpoint + '/' + slug + '/pull/' + pullRequestNumber;
  },

  githubCommit(slug, sha) {
    return config.sourceEndpoint + '/' + slug + '/commit/' + sha;
  },

  githubRepo(slug) {
    return config.sourceEndpoint + '/' + slug;
  },

  githubWatchers(slug) {
    return config.sourceEndpoint + '/' + slug + '/watchers';
  },

  githubNetwork(slug) {
    return config.sourceEndpoint + '/' + slug + '/network';
  },

  githubAdmin(slug) {
    return config.sourceEndpoint + '/' + slug + '/settings/hooks#travis_minibucket';
  },

  statusImage(slug, branch) {
    var prefix = location.protocol + '//' + location.host;

    // the ruby app (waiter) does an indirect, internal redirect to api on build status images
    // but that does not work if you only run `ember serve`
    // so in development we use the api endpoint directly
    if (config.environment === 'development') {
      prefix = config.apiEndpoint;
    }

    if (this.get('features.proVersion')) {
      const token = this.get('auth').token();
      return `${prefix}/${slug}.svg?token=${token}${branch ? '&branch=' + branch : ''}`;
    } else {
      return `${prefix}/${slug}.svg${branch ? '?branch=' + (encodeURIComponent(branch)) : ''}`;
    }
  },

  ccXml(slug, branch) {
    var delimiter, url;
    url = '#' + config.apiEndpoint + '/repos/' + slug + '/cc.xml';
    if (branch) {
      url = url + '?branch=' + branch;
    }
    if (this.get('features.proVersion')) {
      const token = this.get('auth').token();
      delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url = '' + url + delimiter + 'token=' + token;
    }
    return url;
  },

  email(email) {
    return 'mailto:' + email;
  },

  gravatarImage(email, size) {
    return 'https://www.gravatar.com/avatar/' + (md5(email)) + '?s=' + size + '&d=blank';
  },
});
