import Service from '@ember/service';

export default Service.extend({
  endpoint(vcsType) {
    switch (vcsType) {
      case 'GithubRepository':
      default:
        return 'https://github.com';
    }
  },

  repoUrl(vcsType, slug) {
    return `${this.endpoint(vcsType)}/${slug}`;
  },

  pullRequestUrl(vcsType, slug, pullRequestNumber) {
    return `${this.endpoint(vcsType)}/${slug}/pull/${pullRequestNumber}`;
  },

  branchUrl(vcsType, slug, branch) {
    return `${this.endpoint(vcsType)}/${slug}/tree/${branch}`;
  },

  tagUrl(vcsType, slug, tag) {
    return `${this.endpoint(vcsType)}/${slug}/releases/tag/${tag}`;
  },

  commitUrl(vcsType, slug, sha) {
    return `${this.endpoint(vcsType)}/${slug}/commit/${sha}`;
  },
});
