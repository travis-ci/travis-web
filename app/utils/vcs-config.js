export const GITHUB = 'github';
export const BITBUCKET = 'bitbucket';
export const ASSEMBLA = 'assembla';

// keys sorted alphabetically.
const config = {
  [ASSEMBLA]: {
    endpoint: 'https://:user.assembla.com',
    icon: 'icon-assembla',
    name: 'Assembla',
    paths: {
      commit: '/spaces/:slug/git/commits/:sha',
    },
    vocabulary: {
      organization: 'Portfolio',
      pullRequest: 'Merge Request',
    },
  },
  [BITBUCKET]: {
    endpoint: 'https://bitbucket.org',
    icon: 'icon-bitbucket',
    name: 'Bitbucket',
    paths: {
      commit: '/:slug/commits/:sha',
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
  },
  [GITHUB]: {
    endpoint: 'https://github.com',
    icon: 'icon-repooctocat',
    name: 'GitHub',
    paths: {
      commit: '/:slug/commit/:sha',
    },
    vocabulary: {
      organization: 'Organization',
      pullRequest: 'Pull Request',
    },
  },
};

const vcsId = (vcsType) => {
  const match = (vcsType || GITHUB).match(/github|assembla|bitbucket/i);

  if (!match || !config[match[0]]) {
    throw new Error(`Invalid VCS Type "${vcsType}"`);
  }
  return match[0];
};

export default {
  get: (vcsType) => config[vcsId(vcsType)],
};
