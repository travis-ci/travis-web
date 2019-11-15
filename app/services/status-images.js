import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export const IMAGE_FORMATS = {
  'Image URL': 'imageUrl',
  'Markdown': 'markdownImageString',
  'Textile': 'textileImageString',
  'Rdoc': 'rdocImageString',
  'AsciiDoc': 'asciidocImageString',
  'RST': 'rstImageString',
  'Pod': 'podImageString',
  'CCTray': 'ccXml'
};

export default Service.extend({
  auth: service(),
  features: service(),

  imageUrl(repo, branch) {
    let prefix = `${location.protocol}//${location.host}`;

    // the ruby app (waiter) does an indirect, internal redirect to api on build status images
    // but that does not work if you only run `ember serve`
    // so in development we use the api endpoint directly
    if (config.environment === 'development') {
      prefix = config.apiEndpoint;
    }

    let slug = repo.get('slug');

    // In Enterprise you can toggle public mode, where even "public" repositories are hidden
    // in which cases we need to generate a token for all images
    if (!config.publicMode || repo.get('private')) {
      const token = this.auth.assetToken;
      return `${prefix}/${slug}.svg?token=${token}${branch ? `&branch=${branch}` : ''}`;
    } else {
      return `${prefix}/${slug}.svg${branch ? `?branch=${encodeURIComponent(branch)}` : ''}`;
    }
  },

  repositoryUrl(repo) {
    return `https://${location.host}/${repo.get('slug')}`;
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
    let url = `#${config.apiEndpoint}/repos/${repo.get('slug')}/cc.xml`;
    if (branch) {
      url = `${url}?branch=${branch}`;
    }
    if (repo.get('private')) {
      const token = this.auth.assetToken;
      const delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url = `${url}${delimiter}token=${token}`;
    }
    return url;
  },
});
