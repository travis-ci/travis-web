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
      accessSettings: '',
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
      accessSettings: '/account/user/:owner',
    },
    vocabulary: {
      organization: 'Team',
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
      accessSettings: '/settings/connections/applications/f244293c729d5066cf27',
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
  },
};
