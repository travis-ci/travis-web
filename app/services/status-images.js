import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Service.extend({
  auth: service(),
  features: service(),

  imageUrl(repo, branch) {
    const { apiEndpoint } = config;
    const slug = repo.get('slug');

    // In Enterprise you can toggle public mode, where even "public" repositories are hidden
    // in which cases we need to generate a token for all images
    if (!config.publicMode || repo.get('private')) {
      const token = this.get('auth').assetToken();
      return `${apiEndpoint}/${slug}.svg?token=${token}${branch ? `&branch=${branch}` : ''}`;
    } else {
      return `${apiEndpoint}/${slug}.svg${branch ? `?branch=${encodeURIComponent(branch)}` : ''}`;
    }
  },

  repositoryUrl(repo) {
    const { apiEndpoint } = config;
    return `${apiEndpoint}/${repo.get('slug')}`;
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
      const token = this.get('auth').assetToken();
      const delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url = `${url}${delimiter}token=${token}`;
    }
    return url;
  },
});
