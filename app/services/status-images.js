import Ember from 'ember';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Ember.Service.extend({
  @service auth: null,
  @service features: null,

  imageUrl(repo, branch) {
    let prefix = `${location.protocol}//${location.host}`;

    // the ruby app (waiter) does an indirect, internal redirect to api on build status images
    // but that does not work if you only run `ember serve`
    // so in development we use the api endpoint directly
    if (config.environment === 'development') {
      prefix = config.apiEndpoint;
    }

    let slug = repo.get('slug');

    if (repo.get('private')) {
      const token = this.get('auth').assetToken();
      return `${prefix}/${slug}.svg?token=${token}${branch ? `&branch=${branch}` : ''}`;
    } else {
      return `${prefix}/${slug}.svg${branch ? `?branch=${encodeURIComponent(branch)}` : ''}`;
    }
  },

  repositoryUrl(slug) {
    return `https://${location.host}/${slug}`;
  },

  markdownImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `[![Build Status](${imageUrl})](${url})`;
  },

  textileImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `!${imageUrl}!:${url}`;
  },

  rdocImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `{<img src="${imageUrl}" alt="Build Status" />}[${url}]`;
  },

  asciidocImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `image:${imageUrl}["Build Status", link="${url}"]`;
  },

  rstImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `.. image:: ${imageUrl}\n    :target: ${url}`;
  },

  podImageString(repo, branch) {
    const url = this.repositoryUrl(repo);
    const imageUrl = this.imageUrl(repo, branch);
    return `=for html <a href="${url}"><img src="${imageUrl}"></a>`;
  },

  ccXml(repo, branch) {
    let url = `#${config.apiEndpoint}/repos/${slug}/cc.xml`;
    if (branch) {
      url = `${url}?branch=${branch}`;
    }
    if (repo.get('private')) {
      const token = this.get('auth').assetToken();
      const delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url = `${url}${delimiter}token=${token}`;
    }
    return url;
  },
});
