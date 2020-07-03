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
  GITLAB: {
    ORG: 'GitlabOrganization',
    REPO: 'GitlabRepository',
    USER: 'GitlabUser'
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
    endpoint: 'https://app.assembla.com',
    icon: 'icon-assembla',
    name: 'Assembla',
    urlPrefix: 'assembla',
    paths: {
      branch: '/spaces/:owner/:vscId/source/:branch?type=branch',
      commit: '/spaces/:owner/:vcsId/commits/:commit',
      file: '/spaces/:owner/:vcsId/source/:branch/:file',
      issue: '/spaces/:owner/tickets/:issue',
      profile: '/spaces/:owner',
      repo: '/spaces/:owner/:vcsId/source',
      tag: '/spaces/:owner/:vcsId/source/:tag?type=tag',
      accessSettings: '',
    },
    vocabulary: {
      organization: 'Space',
      pullRequest: 'Merge Request',
    },
    colors: {
      main: 'grey',
      light: 'grey-light',
    },
  },

  bitbucket: {
    vcsTypes: [VCS_TYPES.BITBUCKET.ORG, VCS_TYPES.BITBUCKET.REPO, VCS_TYPES.BITBUCKET.USER],
    endpoint: 'https://bitbucket.org',
    icon: 'icon-bitbucket',
    name: 'Bitbucket',
    urlPrefix: 'bitbucket',
    paths: {
      branch: '/:owner/:repo/branch/:branch',
      commit: '/:owner/:repo/commits/:commit',
      file: '/:owner/:repo/src/:branch/:file',
      issue: '/:owner/:repo/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/src/:tag',
      accessSettings: '/:owner/profile/teams',
    },
    vocabulary: {
      organization: 'Team',
      pullRequest: 'Pull Request',
    },
    colors: {
      main: 'blue',
      light: 'blue-light',
    },
  },

  gitlab: {
    vcsTypes: [VCS_TYPES.GITLAB.ORG, VCS_TYPES.GITLAB.REPO, VCS_TYPES.GITLAB.USER],
    endpoint: 'https://gitlab.com',
    icon: 'icon-gitlab',
    name: 'GitLab',
    urlPrefix: 'gitlab',
    paths: {
      branch: '/:owner/:repo/-/tree/:branch',
      commit: '/:owner/:repo/-/tree/:commit',
      file: '/:owner/:repo/-/blob/:branch/:file',
      issue: '/:owner/:repo/-/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/-/tree/:tag',
      accessSettings: '/dashboard/groups',
    },
    vocabulary: {
      organization: 'Group',
      pullRequest: 'Merge Request',
    },
    colors: {
      main: 'red-300',
      light: 'red-300',
    },
  },

  github: {
    vcsTypes: [VCS_TYPES.GITHUB.ORG, VCS_TYPES.GITHUB.REPO, VCS_TYPES.GITHUB.USER],
    isDefault: true,
    endpoint: 'https://github.com',
    icon: 'icon-repooctocat',
    name: 'GitHub',
    urlPrefix: 'github',
    paths: {
      branch: '/:owner/:repo/tree/:branch',
      commit: '/:owner/:repo/commit/:commit',
      file: '/:owner/:repo/blob/:branch/:file',
      issue: '/:owner/:repo/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/releases/tag/:tag',
      accessSettings: process.env.GITHUB_ORGS_OAUTH_ACCESS_SETTINGS_URL,
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
    colors: {
      main: 'grey-dark',
      light: 'grey',
    },
  },
});
