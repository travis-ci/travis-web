/* eslint-env node */
'use strict';

const deepFreeze = require('deep-freeze');

const VCS_TYPES = {
  ASSEMBLA: {
    ORG: 'AssemblaOrganization',
    REPO: 'AssemblaRepository',
    USER: 'AssemblaUser'
  },
  BITBUCKET: {
    ORG: 'BitbucketOrganization',
    REPO: 'BitbucketRepository',
    USER: 'BitbucketUser'
  },
  GITHUB: {
    ORG: 'GithubOrganization',
    REPO: 'GithubRepository',
    USER: 'GithubUser'
  }
};

// keys sorted alphabetically
module.exports = deepFreeze({
  assembla: {
    vcsTypes: [VCS_TYPES.ASSEMBLA.ORG, VCS_TYPES.ASSEMBLA.REPO, VCS_TYPES.ASSEMBLA.USER],
    endpoint: 'https://:portfolio.assembla.com',
    icon: 'icon-assembla',
    name: 'Assembla',
    paths: {
      branch: '/spaces/:owner/:repo/source/:branch?type=branch',
      commit: '/spaces/:owner/:repo/commits/:commit',
      file: '/spaces/:owner/:repo/source/:branch/:file',
      issue: '/spaces/:owner/tickets/:issue',
      profile: '/spaces/:owner',
      repo: '/spaces/:owner/:repo/source',
      tag: '/spaces/:owner/:repo/source/:tag?type=tag',
    },
    vocabulary: {
      organization: 'Portfolio',
      pullRequest: 'Merge Request',
    },
  },

  bitbucket: {
    vcsTypes: [VCS_TYPES.BITBUCKET.ORG, VCS_TYPES.BITBUCKET.REPO, VCS_TYPES.BITBUCKET.USER],
    endpoint: 'https://bitbucket.org',
    icon: 'icon-bitbucket',
    name: 'Bitbucket',
    paths: {
      branch: '/:owner/:repo/src/:branch',
      commit: '/:owner/:repo/commits/:commit',
      file: '/:owner/:repo/src/:branch/:file',
      issue: '/:owner/:repo/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/src/:tag',
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
  },

  github: {
    vcsTypes: [VCS_TYPES.GITHUB.ORG, VCS_TYPES.GITHUB.REPO, VCS_TYPES.GITHUB.USER],
    isDefault: true,
    endpoint: 'https://github.com',
    icon: 'icon-repooctocat',
    name: 'GitHub',
    paths: {
      branch: '/:owner/:repo/tree/:branch',
      commit: '/:owner/:repo/commit/:commit',
      file: '/:owner/:repo/blob/:branch/:file',
      issue: '/:owner/:repo/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/releases/tag/:tag',
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
  },
});
