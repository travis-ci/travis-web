/* eslint-env node */
'use strict';

const deepFreeze = require('deep-freeze');

const {
  GITHUB_ORGS_OAUTH_ACCESS_SETTINGS_URL,
  ENDPOINT_PORTFOLIO,
  DEFAULT_PROVIDER,
  VCS_PROXY_PROVIDER_URL,
} = (process && process.env) || {};

const VCS_TYPES = {
  ASSEMBLA: {
    ORG: 'AssemblaOrganization',
    REPO: 'AssemblaRepository',
    USER: 'AssemblaUser',
  },
  BITBUCKET: {
    ORG: 'BitbucketOrganization',
    REPO: 'BitbucketRepository',
    USER: 'BitbucketUser',
  },
  GITLAB: {
    ORG: 'GitlabOrganization',
    REPO: 'GitlabRepository',
    USER: 'GitlabUser',
  },
  GITHUB: {
    ORG: 'GithubOrganization',
    REPO: 'GithubRepository',
    USER: 'GithubUser',
  },
  TRAVIS_PROXY: {
    ORG: 'TravisproxyOrganization',
    REPO: 'TravisproxyRepository',
    USER: 'TravisproxyUser',
  },
};

// keys sorted alphabetically
module.exports = deepFreeze({
  assembla: {
    isDefault: DEFAULT_PROVIDER === 'assembla',
    isBeta: false,
    vcsTypes: [
      VCS_TYPES.ASSEMBLA.ORG,
      VCS_TYPES.ASSEMBLA.REPO,
      VCS_TYPES.ASSEMBLA.USER,
    ],
    endpointPortfolio: ENDPOINT_PORTFOLIO,
    endpoint: 'https://app.assembla.com',
    icon: 'icon-assembla',
    name: 'Assembla',
    urlPrefix: 'assembla',
    paths: {
      branch: '/spaces/:owner/:vcsId/source/:branch?type=branch',
      branchSvn: '/spaces/:owner/:vcsId/source/HEAD/branches/:branch',
      branchSvnTrunk: '/spaces/:owner/:vcsId/source/HEAD/:branch',
      branchPerforce: '/spaces/:owner/:vcsId/source/:commit/depot/:branch',
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
      pr: 'MR',
    },
    colors: {
      main: 'grey',
      light: 'grey-light',
    },
  },

  bitbucket: {
    isDefault: DEFAULT_PROVIDER === 'bitbucket',
    isBeta: true,
    vcsTypes: [
      VCS_TYPES.BITBUCKET.ORG,
      VCS_TYPES.BITBUCKET.REPO,
      VCS_TYPES.BITBUCKET.USER,
    ],
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
      pr: 'PR',
    },
    colors: {
      main: 'blue',
      light: 'blue-light',
    },
  },

  gitlab: {
    isDefault: DEFAULT_PROVIDER === 'gitlab',
    isBeta: true,
    vcsTypes: [
      VCS_TYPES.GITLAB.ORG,
      VCS_TYPES.GITLAB.REPO,
      VCS_TYPES.GITLAB.USER,
    ],
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
      pr: 'MR',
    },
    colors: {
      main: 'red-300',
      light: 'red-300',
    },
  },

  github: {
    isDefault: DEFAULT_PROVIDER === 'github' || !DEFAULT_PROVIDER,
    isBeta: false,
    vcsTypes: [
      VCS_TYPES.GITHUB.ORG,
      VCS_TYPES.GITHUB.REPO,
      VCS_TYPES.GITHUB.USER,
    ],
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
      accessSettings: GITHUB_ORGS_OAUTH_ACCESS_SETTINGS_URL,
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
      pr: 'PR',
    },
    colors: {
      main: 'grey-dark',
      light: 'grey',
    },
  },

  travisproxy: {
    isDefault: DEFAULT_PROVIDER === 'travisproxy',
    isBeta: true,
    vcsTypes: [
      VCS_TYPES.TRAVIS_PROXY.ORG,
      VCS_TYPES.TRAVIS_PROXY.REPO,
      VCS_TYPES.TRAVIS_PROXY.USER,
    ],
    endpoint: VCS_PROXY_PROVIDER_URL,
    icon: 'icon-travis-proxy',
    name: 'Travis CI VCS Proxy',
    urlPrefix: 'travisproxy',
    paths: {
      branch: '/:owner/:repo/-/tree/:branch',
      commit: '/:owner/:repo/-/tree/:commit',
      file: '/:owner/:repo/-/blob/:branch/:file',
      issue: '/:owner/:repo/-/issues/:issue',
      profile: '/:owner',
      repo: '/:owner/:repo',
      tag: '/:owner/:repo/-/tree/:tag',
      accessSettings: '/',
    },
    vocabulary: {
      organization: 'VCS Server',
      pullRequest: 'Merge Request',
      pr: 'MR',
    },
    colors: {
      main: 'red-300',
      light: 'red-300',
    },
  },
});
