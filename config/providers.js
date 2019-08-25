/* eslint-env node */
'use strict';

// keys sorted alphabetically
module.exports = {
  assembla: {
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
};
