import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),
  features: service(),

  imageUrl(slug, branch) {
    let prefix = `${location.protocol}//${location.host}`;

    // the ruby app (waiter) does an indirect, internal redirect to api on build status images
    // but that does not work if you only run `ember serve`
    // so in development we use the api endpoint directly
    if (config.environment === 'development') {
      prefix = config.apiEndpoint;
    }

    if (this.get('features.proVersion')) {
      const token = this.get('auth').assetToken();
      return `${prefix}/${slug}.svg?token=${token}${branch ? `&branch=${branch}` : ''}`;
    } else {
      return `${prefix}/${slug}.svg${branch ? `?branch=${encodeURIComponent(branch)}` : ''}`;
    }
  },

  repositoryUrl(slug) {
    return `https://${location.host}/${slug}`;
  },

  markdownImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `[![Build Status](${imageUrl})](${url})`;
  },

  textileImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `!${imageUrl}!:${url}`;
  },

  rdocImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `{<img src="${imageUrl}" alt="Build Status" />}[${url}]`;
  },

  asciidocImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `image:${imageUrl}["Build Status", link="${url}"]`;
  },

  rstImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `.. image:: ${imageUrl}\n    :target: ${url}`;
  },

  podImageString(slug, branch) {
    const url = this.repositoryUrl(slug);
    const imageUrl = this.imageUrl(slug, branch);
    return `=for html <a href="${url}"><img src="${imageUrl}"></a>`;
  },

  ccXml(slug, branch) {
    let url = `#${config.apiEndpoint}/repos/${slug}/cc.xml`;
    if (branch) {
      url = `${url}?branch=${branch}`;
    }
    if (this.get('features.proVersion')) {
      const token = this.get('auth').assetToken();
      const delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url = `${url}${delimiter}token=${token}`;
    }
    return url;
  },
});
